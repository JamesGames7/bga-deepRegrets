<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * Sets active player for **Bearings** state - 0 notifications.
 * 
 * 1. If first time, activate first player
 * 
 * 2. Otherwise activate next player
 */
// TODO: Correct values
class BearingsNP extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 30,
            type: StateType::GAME,

            // optional
            description: clienttranslate(''),
            transitions: ["nextPlayer" => 31, "donePlayers" => 32, "skipPhase" => 40], // LINK - modules\php\States\Bearings.php
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
        if ($this->globals->get("day") > 1) {
            if (!$this->globals->get("firstPlayerReached")) {
                $this->globals->set("firstPlayerReached", true);
                $this->gamestate->changeActivePlayer($this->globals->get("firstPlayer"));
            } else {
                $this->game->activeNextPlayer();
                if ($this->game->getActivePlayerId() == $this->globals->get("firstPlayer")) {
                    $this->gamestate->nextState("donePlayers");
                }
            }
            $this->gamestate->nextState("nextPlayer");
        } else {
            $this->globals->set("firstPlayerReached", false);
            $this->gamestate->nextState("skipPhase");
        }
    } 
}