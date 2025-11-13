<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief Players choose sea or port - 1 notification.
 * @details
 * 1. Active player chooses to go to sea or port
 * 
 * 2. Either go back a state (repeat) or pass to next state
 */
// TODO: Correct values
class Bearings extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 31,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must choose to go to sea or port'),
            descriptionMyTurn: clienttranslate('${you} must choose to go to sea or port'),
            transitions: ["nextPlayer" => 30, "donePlayers" => 32], // LINK - modules\php\States\BearingsNP.php
                                                                    // LINK - modules\php\States\RodReelNP.php
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