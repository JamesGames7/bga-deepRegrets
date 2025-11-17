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
        return [];
    } 

    #[PossibleAction]
    function actChooseDice(int $currentPlayerId, array $diceArray) {
        $idArray = [];
        foreach ($diceArray as $die) {
            $id = $die["id"];
            $idArray[] = $id;
        }

        $this->game->dice->moveCards($idArray, "fresh", $currentPlayerId);
        $this->game->dice->moveAllCardsInLocation("roll", "spent", $currentPlayerId, $currentPlayerId);
    }

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
        $this->game->dice->moveAllCardsInLocation("spent", "roll", $activePlayerId, $activePlayerId);

        foreach ($this->game->dice->getCardsInLocation("roll", $activePlayerId) as $die) {
            $newSide = \bga_rand(0, 3);
            $id = $die["id"];

            $this->game->DbQuery("UPDATE `dice` SET `card_type_arg` = $newSide WHERE `card_id` = $id");
        }
        // ! Notify

        $regrets = $this->game->regrets->countCardsInLocation("hand", $activePlayerId);
        $regrets > 13 ? $regrets = 13 : $regrets = $regrets;
        $maxDice = $this->MADNESS[$regrets];

        if ($this->game->dice->countCardsInLocation("roll", $activePlayerId) + $this->game->dice->countCardsInLocation("fresh") <= $maxDice) {
            $this->gamestate->unsetPrivateState($activePlayerId);
            $this->gamestate->setPlayerNonMultiactive($activePlayerId, "");
        }
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}