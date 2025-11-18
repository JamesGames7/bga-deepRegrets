<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * Players choose a rod and a reel - 1 notification.
 * 
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
            transitions: ["" => 31], // LINK - modules\php\States\RodReelNP.php
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        $totalRods = $this->game->rods->countCardsInLocation("hand", $activePlayerId) + $this->game->rods->countCardsInLocation("equip", $activePlayerId);
        $totalReels = $this->game->reels->countCardsInLocation("hand", $activePlayerId) + $this->game->reels->countCardsInLocation("equip", $activePlayerId);
        return [
            "rodsChoice" => $totalRods > 1,
            "reelsChoice" => $totalReels > 1
        ];
    } 

    #[PossibleAction]
    function actChooseRodReel(int $rodId, int $reelId, int $activePlayerId): void {
        // ! Client states to choose rod & reel?
        $this->game->rods->moveCard($rodId, "equip", $activePlayerId);
        $this->game->reels->moveCard($reelId, "equip", $activePlayerId);
        // ! Notify

        $this->gamestate->nextState("");
    }

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
        $totalRods = $this->game->rods->countCardsInLocation("hand", $activePlayerId) + $this->game->rods->countCardsInLocation("equip", $activePlayerId);
        $totalReels = $this->game->reels->countCardsInLocation("hand", $activePlayerId) + $this->game->reels->countCardsInLocation("equip", $activePlayerId);
        if ($totalRods <= 1 && $totalReels <= 1) {
            $this->game->rods->moveAllCardsInLocation("hand", "equip", $activePlayerId, $activePlayerId);
            $this->game->reels->moveAllCardsInLocation("hand", "equip", $activePlayerId, $activePlayerId);
            $this->gamestate->nextState("");
        } else {
            $this->game->rods->moveAllCardsInLocation("equip", "hand", $activePlayerId, $activePlayerId);
            $this->game->reels->moveAllCardsInLocation("equip", "hand", $activePlayerId, $activePlayerId);
        }
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}