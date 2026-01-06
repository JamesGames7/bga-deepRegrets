<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

// TODO: Correct values
class FinishFish extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 44,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must pay for the fish'),
            descriptionMyTurn: clienttranslate('${you} must pay for the fish (${num} / ${target})'),
            transitions: ["" => 42],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        $selected = $this->globals->get("selectedShoal");
        $targetCard = $this->game->lists->getFish()[$this->game->fish->getCardOnTop("shoal_$selected")["type"]];

        return [
            "selected" => $selected,
            "LP" => $this->globals->get("lifePreserver") == $activePlayerId,
            "target" => $targetCard->getDifficulty(),
            "num" => 0,
            "gameUrl" => ''
        ];
    } 

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    #[PossibleAction]
    function actFinishFish(string $dice, bool $LP, int $activePlayerId) {
        if ($this->globals->get("casted")) {
            $shoal = $this->globals->get("selectedShoal");

            $fish = $this->game->fish->getCardOnTop("shoal_$shoal");
            $data = $this->game->lists->getFish()[$fish['type']];

            $num = $LP ? 2 : 0;
            foreach(json_decode($dice) as $curDie) {
                $num += $this->game->DICE_VALUES[$curDie->type][intval($curDie->type_arg)];
            }
            
            if ($num >= $data->getDifficulty()) {
                if ($LP) {
                    $this->globals->set("lifePreserver", 0);
                }

                foreach (json_decode($dice) as $curDie) {
                    if ($curDie->type[-1] == "P") {
                        $this->game->dice->moveCard($curDie->id, "spent", $activePlayerId);
                    } else {
                        $this->game->dice->moveCard($curDie->id, "deck");
                    }
                }

                $this->game->fish->moveCard($fish["id"], "hand", $activePlayerId);
                $newTop = $this->game->fish->getCardOnTop("shoal_$shoal");

                $this->notify->all("finishFish", '${player_name} paid for ${fishName} using ${spent}', [
                    "player_name" => $this->game->getActivePlayerName(),
                    "player_id" => $activePlayerId,
                    "fishName" => $data->getName(),
                    "spent" => strval(count(json_decode($dice))) . " dice" . ($LP ? " and the Life Preserver" : ""),
                    "moved" => json_decode($dice),
                    "LP" => $LP,
                    "shoal" => $this->globals->get("selectedShoal"),
                    "newTop" => $this->game->lists->getFish()[$newTop["type"]]->getHidden()
                ]);

                $revealed = $this->globals->get("revealedShoals");
                $revealed[$this->globals->get("selectedShoal") - 1] = false;
                $this->notify->all("test", '', [
                    "revealed" => $revealed
                ]);
                $this->globals->set("revealedShoals", $revealed);
                $this->globals->set("selectedShoal", 0);
                $this->globals->set("casted", true);
                return "";
            } else {
                throw new \BgaUserException("Not enough value to fish");
            }
        } else {
            throw new \BgaUserException("Can only fish after casting");
        }
    }

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}