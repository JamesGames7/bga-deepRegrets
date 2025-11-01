<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

// TODO: Correct values
class NextPlayer extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 49,
            type: StateType::GAME,

            // optional
            description: clienttranslate(''),
            transitions: ["nextPlayer" => 40, "nextRound" => 10, "end" => 98],
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