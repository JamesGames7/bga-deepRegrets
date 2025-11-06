<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief Handler for different types of actions - 0 notifications.
 * 
 * @details
 * 1. Checks the location the player is currently at
 * 
 * 2. Sends them to the relative state
 */
// TODO: Correct values
class ActionPlace extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 40,
            type: StateType::GAME,

            // optional
            description: clienttranslate(''),
            transitions: ["port" => 41, "sea" => 42, "pass" => 45],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(): array
    {
        // the data sent to the front when entering the state
        return [];
    } 

    function onEnteringState() {
        // the code to run when entering the state
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}