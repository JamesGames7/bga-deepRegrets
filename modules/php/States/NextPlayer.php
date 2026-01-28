<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * Passes active player in main action phase - 0 notifications.
 * 
 * 1. Activate each player in order
 * 
 * 2. If all have passed there are 2 options
 * 
 * 3. Start the next round
 * 
 * 4. End the game: may also handle any final actions within or move to a yet to be created state
 */
class NextPlayer extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 49,
            type: StateType::GAME,

            // optional
            description: clienttranslate(''),
            transitions: ["nextPlayer" => 40, "nextRound" => 10, "end" => 98], // LINK - modules\php\States\ActionPlace.php
                                                                               // LINK - modules\php\States\Start.php
                                                                               // LINK - modules\php\States\EndScore.php
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
        // TODO -  change to go to next round / end
        if (!$this->globals->get("firstPlayerReached")) {
            $this->gamestate->changeActivePlayer($this->globals->get("firstPlayer"));
            $this->globals->set("firstPlayerReached", true);
        } else {
            $this->game->activeNextPlayer();
        }
        $this->globals->set("actionComplete", false);
        return "nextPlayer";
    }
}