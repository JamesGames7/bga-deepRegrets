<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\DeepRegrets\Game;

/**
 * All start of round actions - 5 notifications.
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
            transitions: ["" => 20], // LINK - modules\php\States\MusterCourage.php
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
        // Updates what day it is
        $this->globals->set("day", $this->globals->get("day") + 1);

        // Changes active player
        // TODO: Notifications
        if ($this->globals->get("day") > 1) {
            $this->gamestate->changeActivePlayer($this->globals->get("firstPlayer"));
            $this->game->activeNextPlayer();
            $this->globals->set("firstPlayer", $this->game->getActivePlayerId());
        }

        // Stuff on each day
        switch ($this->globals->get("day")) {
            // * Wed / Fri: Can of Worms
            case "3":
            case "5":
                foreach ($this->game->loadPlayersBasicInfos() as $playerId => $playerInfo) {
                    // Gets the json
                    $json = json_decode($this->game->getUniqueValueFromDB("SELECT `provisions` FROM `player` WHERE `player_id` = $playerId"));
                    // Sets correct value
                    $json->canOfWorms = true;
                    // Reencodes it
                    $json = json_encode($json);
                    // Send back to database
                    $this->game->DbQuery("UPDATE `player` SET `provisions` = '$json' WHERE `player_id` = $playerId");
                    // ! Notify
                }
                break;
            // * Thursday: Payday
            case "4":
                foreach ($this->game->loadPlayersBasicInfos() as $playerId => $playerInfo) {
                    // Get the current value
                    $fishbucks = $this->game->getUniqueValueFromDB("SELECT `fishbucks` FROM `player` WHERE `player_id` = $playerId");
                    // Increment by 3 (to a max of 10)
                    $fishbucks < 7 ? $fishbucks += 3 : $fishbucks = 10;
                    // Send back to database
                    $this->game->DbQuery("UPDATE `player` SET `fishbucks` = $fishbucks WHERE `player_id` = $playerId");
                    // ! Notify
                }
                break;
            // * Saturday: Dice
            case "6":
                // ? Test
                // Number of players
                $numPlayers = count($this->game->loadPlayersBasicInfos());
                // Foreach type of die
                foreach (["orange", "green", "blue"] as $diceColour) {
                    // If there are enough
                    if (count($this->game->dice->getCardsOfTypeInLocation($diceColour, null, "deck")) >= $numPlayers) {
                        // Give one to each player
                        foreach ($this->game->loadPlayersBasicInfos() as $playerId => $playerInfo) {
                            $curDie = array_values($this->game->dice->getCardsOfTypeInLocation($diceColour, null, "deck"))["id"];
                            $this->game->dice->moveCard($curDie, "spent", $playerId);
                        }
                        break;
                    } 
                }
                break;
        }

        // ? Test
        // Reel in / move up depth
        foreach ($this->game->loadPlayersBasicInfos() as $playerId => $playerInfo) {
            if ($this->game->getUniqueValueFromDB("SELECT `location` FROM `player` WHERE `player_id` = $playerId") == "sea") {
                $depth = $this->game->getUniqueValueFromDB("SELECT `depth` FROM `player` WHERE `player_id` = $playerId");
                $depth > 1 ? $depth -= 1 : $depth = 1;
                $this->game->DbQuery("UPDATE `player` SET `depth` = $depth WHERE `player_id` = $playerId");
            }
            // ! Notify
        }

        $this->gamestate->nextState("");
    }
}