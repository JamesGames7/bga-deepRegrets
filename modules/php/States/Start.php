<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * @brief All start of round actions - 5 notifications.
 * @details
 * 1. Move day tracker
 * 
 * 2. Pass first player
 * 
 * 3. Discard revealed fish at sea
 * 
 * 4. Day effects (Wed / Fri, Thur, Sat)
 * 
 * 5. If at sea, go up one depth *(group to one notification)*
 */
// TODO: correct values
class Start extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 10,
            type: StateType::GAME,

            // optional
            description: clienttranslate('Starting the round'),
            transitions: ["" => 20],
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
        $this->globals->set("firstPlayer", $activePlayerId);
    }
}