<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief Players choose a rod and a reel - 1 notification.
 * @details
 * 1. Active player chooses a rod and / or reel *(automatic if possible)*
 * 
 * 2. Either go back a state (repeat) or pass to next state
 */
// TODO: Correct values
class RodReel extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 33,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must choose a rod and / or reel'),
            descriptionMyTurn: clienttranslate('${you} must choose a rod and / or reel'),
            transitions: ["nextPlayer" => 31, "donePlayers" => 49], // LINK - modules\php\States\RodReelNP.php
                                                                    // LINK - modules\php\States\NextPlayer.php
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