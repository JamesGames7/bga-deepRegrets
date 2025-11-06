<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief Possible actions at sea - 1+ notification(s)
 * @details
 * 1. Player can choose which action to perform *(fish or abandon ship)* or to pass
 * 
 * 2. Performs that action - fishing may take multiple notifications
 * 
 * 3. Move to next player state
 */
// TODO: Correct values
class SeaActions extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 42,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must perform Sea actions or pass'),
            descriptionMyTurn: clienttranslate('${you} must perform Sea actions or pass'),
            transitions: ["pass" => 45, "nextPlayer" => 49],
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