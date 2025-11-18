<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * Sets the first player for LifePreserver state
 */
// TODO: Correct values
class LifePreserverNP extends GameState
{
    private $COLOUR = [
        "blue" => [0, 0, 1, 2],
        "green" => [1, 1, 2, 3],
        "orange" => [2, 3, 2, 3],
        "player" => [1, 1, 2, 3],
        "omen" => [1, 2, 3, 4]
    ];
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 29,
            type: StateType::GAME,

            // optional
            description: clienttranslate(''),
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
        $playerIds = array_keys($this->game->loadPlayersBasicInfos());
        $totals = [];
        foreach ($playerIds as $id) {
            $playerDice = $this->game->dice->getCardsInLocation("fresh", $id);
            $curTotal = 0;
            foreach ($playerDice as $die) {
                $curTotal += $this->COLOUR[$die["type"]][$die["type_arg"]];
            }
            $totals[] = $curTotal;
        }

        while ($playerIds[0] != $this->game->globals->get("firstPlayer")) {
            $playerIds[] = array_shift($playerIds);
        }

        $maxVal = max($totals);
        $maxId = $playerIds[array_search($maxVal, $totals)];

        $this->gamestate->changeActivePlayer($maxId);
        return "";
    }
}