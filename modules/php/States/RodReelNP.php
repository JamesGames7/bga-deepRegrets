<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * Sets active player for **RodReel** state - 0 notifications.
 * 
 * 1. If first time, activate first player
 * 
 * 2. Otherwise activate next player
 */
class RodReelNP extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 32,
            type: StateType::GAME,

            // optional
            description: clienttranslate(''),
            transitions: ["nextPlayer" => 33, "donePlayers" => 49], // LINK - modules\php\States\RodReel.php
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

    function onEnteringState() {
        // the code to run when entering the state
        if (!$this->globals->get("firstPlayerReached")) {
            $this->globals->set("firstPlayerReached", true);
            $this->gamestate->changeActivePlayer($this->globals->get("firstPlayer"));
        } else {
            $this->game->activeNextPlayer();
            if ($this->game->getActivePlayerId() == $this->globals->get("firstPlayer")) {
                return "donePlayers";
            }
        }
        return "nextPlayer";
    } 
}