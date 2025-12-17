<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

// TODO: Correct values
class CanOfWorms extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 43,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must choose to place the card on top or at the bottom'),
            descriptionMyTurn: clienttranslate('${you} must choose to place the card on top or at the bottom'),
            transitions: ["" => 42],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        $shoalNum = $this->globals->get("selectedShoal");

        return [
            "shoal" => [floor(($shoalNum - 1) / 3) + 1, ($shoalNum - 1) % 3 + 1],
            "shoalNum" => $shoalNum,
            "_private" => [
                $activePlayerId => [
                    "fish" => $this->game->lists->getFish()[$this->game->fish->getCardOnTop("shoal_" . $this->globals->get("selectedShoal"))['type']]->getData()
                ]
            ]
        ];
    } 

    #[PossibleAction]
    public function actSetPlace(int $activePlayerId, string $place) {
        $cardId = $this->game->fish->getCardOnTop("shoal_" . $this->globals->get("selectedShoal"))['id'];
        $this->game->fish->insertCardOnExtremePosition($cardId, "shoal_" . $this->globals->get("selectedShoal"), $place == "top");

        $newTop = $this->game->lists->getFish()[$this->game->fish->getCardOnTop("shoal_" . $this->globals->get("selectedShoal"))['type']];

        $this->notify->all("canOfWormsMove", '${player_name} saw card at depth ${depth} and moved it to the ${place} of the shoal', [
            "player_name" => $this->game->getActivePlayerName(),
            "player_id" => $this->game->getActivePlayerId(),
            "depth" => floor(($this->globals->get("selectedShoal") - 1) / 3) + 1,
            "shoalNum" => intval($this->globals->get("selectedShoal")),
            "place" => $place,
            "newTop" => [$newTop->getSize(), $newTop->getDepth()]
        ]);

        $this->globals->set("selectedShoal", 0);
        $provisions = json_decode($this->game->getUniqueValueFromDB("SELECT `provisions` FROM `player` WHERE `player_id` = $activePlayerId"));
        $provisions->canOfWorms = false;
        $provisions = json_encode($provisions);
        $this->game->DbQuery("UPDATE `player` SET `provisions` = '$provisions' WHERE `player_id` = $activePlayerId");

        return "";
    }

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}