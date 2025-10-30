<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\Actions\CheckAction;
use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

// TODO: Correct values
class Test extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 2,
            type: StateType::MULTIPLE_ACTIVE_PLAYER,

            // optional
            description: clienttranslate('Other players must play a card or pass'),
            descriptionMyTurn: clienttranslate('${you} must play a card or pass'),
            transitions: ["next" => 2],
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
        $this->gamestate->setAllPlayersMultiactive();
    }   

    #[PossibleAction]
    function actClickButton(int $player) {
        $this->notify->all("test", "Clicked!");
        $this->gamestate->setPlayerNonMultiactive($player, "next");
    }

    #[CheckAction(false)]
    function actActivate(int $player) {
        $this->notify->all("activate", "Activated");
        $this->gamestate->setPlayersMultiactive([$player], "next");
    }

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}