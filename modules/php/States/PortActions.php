<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * Possible actions at the port - 1-2 notification(s)
 * 
 * 1. Player can choose which action to perform or to pass
 * 
 * 2. Performs that action - could involve choosing cards and thus +1 notification: client states
 * 
 * 3. Move to next player state
 */
// TODO: Correct values
class PortActions extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 41,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must perform Port actions or pass'),
            descriptionMyTurn: clienttranslate('${you} must perform Port actions or pass'),
            transitions: ["pass" => 45, "nextPlayer" => 49], // LINK - modules\php\States\PassAction.php
                                                             // LINK - modules\php\States\NextPlayer.php
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        $shops = json_decode($this->game->getUniqueValueFromDB("SELECT `shops` FROM `player` WHERE player_id = $activePlayerId"));
        return [
            "reels" => $shops->reels,
            "rods" => $shops->rods,
            "supplies" => $shops->supplies,
            "dice" => $shops->dice,
        ];
    } 

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    #[PossibleAction]
    function actShop(string $shop) {
        
    }

    #[PossibleAction]
    function actSell(string $fish) {
        
    }

    #[PossibleAction]
    function actMount(int $fishId) {
        
    }

    #[PossibleAction]
    function actPass() {
        return "pass";
    }

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}