<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

// TODO: Correct values
class SelectFreshPRIV extends GameState
{
    private $MADNESS = [
        0 => 4,
        1 => 5,
        2 => 5,
        3 => 5,
        4 => 5,
        5 => 5,
        6 => 5,
        7 => 6,
        8 => 6,
        9 => 6,
        10 => 7,
        11 => 7,
        12 => 7,
        13 => 8
    ];

    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 81,
            type: StateType::PRIVATE,

            // optional
            descriptionMyTurn: clienttranslate('${you} must select which dice to place in your fresh pool'),
            transitions: [],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(): array
    {
        // the data sent to the front when entering the state
        return [array_values($this->game->dice->getCardsInLocation("roll"))];
    } 

    // TODO work frontend without reload
    #[PossibleAction]
    function actChooseDice(int $currentPlayerId, string $diceArray) {
        $dice = json_decode($diceArray);
        $moveSize = count($dice);
        $freshSize = $this->game->dice->countCardsInLocation("fresh", $currentPlayerId);
        $allowedSize = $this->MADNESS[$this->game->regrets->countCardsInLocation("hand", $currentPlayerId)];
        if ($allowedSize == $moveSize + $freshSize) {
            $this->game->dice->moveCards($dice, "fresh", $currentPlayerId);

            $this->notify->all("selectFresh", '', [
                "ids" => array_map(fn($d) => $this->game->dice->getCard($d), $dice),
                "player_id" => $currentPlayerId,
                "other" => array_values($this->game->dice->getCardsInLocation("roll", $currentPlayerId))
            ]);

            $this->game->dice->moveAllCardsInLocation("roll", "spent", $currentPlayerId, $currentPlayerId);

            $this->gamestate->setPlayerNonMultiactive($currentPlayerId, "");
        } else {
            throw new \BgaUserException('Wrong number of dice (${num} expected)', 100, ["num" => $allowedSize]);
        }
    }

    function onEnteringState(int $playerId) {
        // the code to run when entering the state
        $this->game->dice->moveAllCardsInLocation("spent", "roll", $playerId, $playerId);

        foreach ($this->game->dice->getCardsInLocation("roll", $playerId) as $die) {
            $newSide = \bga_rand(0, 3);
            $id = $die["id"];

            $this->game->DbQuery("UPDATE `dice` SET `card_type_arg` = $newSide WHERE `card_id` = $id");
        }

        $regrets = $this->game->regrets->countCardsInLocation("hand", $playerId);
        $regrets > 13 ? $regrets = 13 : $regrets = $regrets;
        $maxDice = $this->MADNESS[$regrets];

        if ($this->game->dice->countCardsInLocation("roll", $playerId) + $this->game->dice->countCardsInLocation("fresh", $playerId) <= $maxDice) {
            $this->gamestate->unsetPrivateState($playerId);
            $this->game->dice->moveAllCardsInLocation("roll", "fresh", $playerId, $playerId);
            $this->gamestate->setPlayerNonMultiactive($playerId, "");
        }
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}