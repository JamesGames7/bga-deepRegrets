<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * Toss life preserver - 1 notification.
 *  
 * 1. Active player (highest total) chooses a player to receive the life preserver
 */
class LifePreserver extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 21,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must toss the life preserver to someone else'),
            descriptionMyTurn: clienttranslate('${you} must toss the life preserver to someone else'),
            transitions: ["" => 30], // LINK - modules\php\States\BearingsNP.php
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs( int $activePlayerId ): array
    {
        // the data sent to the front when entering the state
        $otherPlayers = [];
        foreach (array_keys($this->game->loadPlayersBasicInfos()) as $id) {
            if ($id != $activePlayerId) {
                $otherPlayers[] = $id;
            }
        }
        return ["possibleChoices" => $otherPlayers];
    } 

    #[PossibleAction]
    function actChooseLPPlayer(int $playerId, int $activePlayerId) {
        if ($playerId != $activePlayerId) {
            $this->game->globals->set("lifePreserver", $playerId);
            $this->notify->all("lifePreserver", \clienttranslate('${player_name1} threw the life preserver to ${player_name2}'), [
                'player_id1' => $activePlayerId,
                'player_name1' => $this->game->getPlayerNameById($activePlayerId),
                'player_id2' => $playerId,
                'player_name2' => $this->game->getPlayerNameById($playerId),
            ]);
            return "";
        } else {
            throw new \BgaUserException("Cannot select yourself");
        }
    }

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}