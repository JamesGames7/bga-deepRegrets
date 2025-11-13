<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief Choose dice - Notification when you confirm & multiple when action done.
 * @details 
 * 1. Players choose which dice to roll *(all from **Spent** + some from **Fresh**)*
 * 
 * 2. Players choose which dice to put in **Fresh Pool** *(up to max - automate)*
 * 
 * 3. Confirm - send notification **to player** & store their choice in db
 * 
 * 4. When all have confirmed, send notification **to all except the player** for each player
 * 
 * 5. Set highest player active
 */
// TODO: Correct values
class MusterCourage extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 20,
            type: StateType::MULTIPLE_ACTIVE_PLAYER,
            
            // optional
            description: clienttranslate('Other players must choose which dice to place in their fresh pool'),
            descriptionMyTurn: clienttranslate('${you} must choose which dice to place in their fresh pool'),
            transitions: ["" => 21], // LINK - modules\php\States\LifePreserver.php
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
        /**
         * * Check if have dice in fresh pool
         * * * Choose which to roll
         * * Roll dice
         * * * Choose which to place in spent pool
         */
        $this->gamestate->setAllPlayersMultiactive();
        
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}