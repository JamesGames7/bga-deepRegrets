<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief Sets active player for **RodReel** state - 0 notifications.
 * @details
 * 1. If first time, activate first player
 * 
 * 2. Otherwise activate next player
 */
// TODO: Correct values
class RodReelNP extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 32,
            type: StateType::GAME,

            // optional
            description: clienttranslate('${actplayer} must play a card or pass'),
            descriptionMyTurn: clienttranslate('${you} must play a card or pass'),
            transitions: ["" => 33],
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