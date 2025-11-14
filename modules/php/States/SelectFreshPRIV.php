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

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}