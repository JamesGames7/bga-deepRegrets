<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

class SelectRollPRIV extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 80,
            type: StateType::PRIVATE,

            // optional
            descriptionMyTurn: clienttranslate('${you} must choose which fresh dice to reroll'),
            transitions: ["" => 81],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(): array
    {
        // the data sent to the front when entering the state
        return [];
    } 

    #[PossibleAction]
    function actChooseDice(int $currentPlayerId, string $diceArray): void {
        foreach (json_decode($diceArray) as $die) {
            $this->game->dice->moveCard($die, "roll", $currentPlayerId);
        }
        $this->gamestate->nextPrivateState($currentPlayerId, "");
    }

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}