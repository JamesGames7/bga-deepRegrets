<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * DeepRegrets implementation : © Connor Rask connor@srask.ca
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * Game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 */
declare(strict_types=1);

namespace Bga\Games\DeepRegrets;

use Bga\GameFramework\Actions\CheckAction;
use Bga\GameFramework\Components\Deck;
use Bga\Games\DeepRegrets\States\Start;
use Lists;
require_once("Lists.php");

class Game extends \Bga\GameFramework\Table
{
    public Deck $regrets;
    public Deck $dinks;
    public Deck $rods;
    public Deck $reels;
    public Deck $supplies;
    public Deck $fish;
    public Deck $dice;
    public Lists $lists;

    /**
     * Your global variables labels:
     *
     * Here, you can assign labels to global variables you are using for this game. You can use any number of global
     * variables with IDs between 10 and 99. If you want to store any type instead of int, use $this->globals instead.
     *
     * NOTE: afterward, you can get/set the global variables with `getGameStateValue`, `setGameStateInitialValue` or
     * `setGameStateValue` functions.
     */
    public function __construct()
    {
        parent::__construct();
        $this->initGameStateLabels([]); // mandatory, even if the array is empty

        /* example of notification decorator.
        // automatically complete notification args when needed
        $this->notify->addDecorator(function(string $message, array $args) {
            if (isset($args['player_id']) && !isset($args['player_name']) && str_contains($message, '${player_name}')) {
                $args['player_name'] = $this->getPlayerNameById($args['player_id']);
            }
        
            if (isset($args['card_id']) && !isset($args['card_name']) && str_contains($message, '${card_name}')) {
                $args['card_name'] = self::$CARD_TYPES[$args['card_id']]['card_name'];
                $args['i18n'][] = ['card_name'];
            }
            
            return $args;
        });*/

        $this->regrets = $this->deckFactory->createDeck('regrets');
        $this->dinks = $this->deckFactory->createDeck('dinks');
        $this->rods = $this->deckFactory->createDeck('rods');
        $this->reels = $this->deckFactory->createDeck('reels');
        $this->supplies = $this->deckFactory->createDeck('supplies');
        $this->fish = $this->deckFactory->createDeck('fish');
        $this->dice = $this->deckFactory->createDeck('dice');
        $this->lists = new Lists;
    }

    /**
     * Compute and return the current game progression.
     *
     * The number returned must be an integer between 0 and 100.
     *
     * This method is called each time we are in a game state with the "updateGameProgression" property set to true.
     *
     * @return int
     * @see ./states.inc.php
     */
    public function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }

    /**
     * Migrate database.
     *
     * You don't have to care about this until your game has been published on BGA. Once your game is on BGA, this
     * method is called everytime the system detects a game running with your old database scheme. In this case, if you
     * change your database scheme, you just have to apply the needed changes in order to update the game database and
     * allow the game to continue to run with your new version.
     *
     * @param int $from_version
     * @return void
     */
    public function upgradeTableDb($from_version)
    {
//       if ($from_version <= 1404301345)
//       {
//            // ! important ! Use `DBPREFIX_<table_name>` for all tables
//
//            $sql = "ALTER TABLE `DBPREFIX_xxxxxxx` ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//       }
//
//       if ($from_version <= 1405061421)
//       {
//            // ! important ! Use `DBPREFIX_<table_name>` for all tables
//
//            $sql = "CREATE TABLE `DBPREFIX_xxxxxxx` ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//       }
    }

    /*
     * Gather all information about current game situation (visible by the current player).
     *
     * The method is called each time the game interface is displayed to a player, i.e.:
     *
     * - when the game starts
     * - when a player refreshes the game page (F5)
     */
    protected function getAllDatas(): array
    {
        $result = [];

        // WARNING: We must only return information visible by the current player.
        $current_player_id = (int) $this->getCurrentPlayerId();

        // Get information about players.
        // NOTE: you can retrieve some extra field you added for "player" table in `dbmodel.sql` if you need it.
        $result["players"] = $this->getCollectionFromDb(
            "SELECT `player_id` `id`, `player_score` `score`, `playerBoard`, `fishbucks`, `provisions`, `location`, `depth` FROM `player`"
        );

        foreach(array_keys($this->loadPlayersBasicInfos()) as $id) {
            $result["players"][$id]["dice"] = $this->dice->getCardsInLocation(["spent", "fresh", "roll"], $id);
            $result["players"][$id]["regretCount"] = intval($this->dice->countCardsInLocation("hand", $id));
        }
        
        for ($i = 1; $i <= 9; $i++) {
            if ($this->fish->countCardsInLocation("shoal_$i") > 0) {
                $topFish = array_values($this->fish->getCardsInLocation("shoal_$i", $this->fish->getExtremePosition(true, "shoal_$i")))[0];
                $fishData = $this->lists->getFish()[$topFish["type"]];
                if ($this->globals->get("revealedShoals")[$i - 1]) {
                    $curFish = $fishData->getData();
                } else {
                    $curFish = false;
                }
                $result["shoals"][] = [$this->fish->countCardsInLocation("shoal_$i"),
                                        $fishData->getSize(),
                                        $fishData->getDepth(),
                                        $curFish];
            } else {
                $result["shoals"][] = false;
            }
        }

        $result["regrets"] = [$this->regrets->countCardsInLocation("deck"), $this->regrets->countCardsInLocation("discard")];

        $result["reels"] = $this->reels->countCardInLocation("deck");
        $result["rods"] = $this->rods->countCardInLocation("deck");
        $result["supplies"] = $this->supplies->countCardInLocation("deck");

        $result["day"] = $this->globals->get("day");
        $result["firstPlayer"] = $this->globals->get("firstPlayer");

        $result["dinks"] = $this->dinks->countCardsInLocation("deck");

        return $result;
    }

    /**
     * This method is called only once, when a new game is launched. In this method, you must setup the game
     *  according to the game rules, so that the game is ready to be played.
     */
    protected function setupNewGame($players, $options = [])
    {
        // Set the colors of the players with HTML color code. The default below is red/green/blue/orange/brown. The
        // number of colors defined here must correspond to the maximum number of players allowed for the gams.
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        foreach ($players as $player_id => $player) {
            // Now you can access both $player_id and $player array
            $query_values[] = vsprintf("('%s', '%s', '%s', '%s', '%s')", [
                $player_id,
                array_shift($default_colors),
                $player["player_canal"],
                addslashes($player["player_name"]),
                addslashes($player["player_avatar"]),
            ]);
        }

        // Create players based on generic information.
        //
        // NOTE: You can add extra field on player table in the database (see dbmodel.sql) and initialize
        // additional fields directly here.
        static::DbQuery(
            sprintf(
                "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES %s",
                implode(",", $query_values)
            )
        );

        $this->reattributeColorsBasedOnPreferences($players, $gameinfos["player_colors"]);
        $this->reloadPlayersBasicInfos();

        // Init global values with their initial values.
        static::DbQuery("UPDATE `player` SET `provisions` = JSON_OBJECT('canOfWorms', true, 'lifeboat', true);");
        $this->globals->set("firstPlayer", 0);
        $this->globals->set("lifePreserver", 0);
        $this->globals->set("day", 0);
        $this->globals->set("revealedShoals", [false, false, false, false, false, false, false, false, false]);

        // Everything to do with dice deck setup
        $dice = [];
        $dice[] = ['type' => "blueP", "type_arg" => 0, "nbr" => 3];
        $dice[] = ['type' => "greenP", "type_arg" => 0, "nbr" => 3];
        $dice[] = ['type' => "redP", "type_arg" => 0, "nbr" => 3];
        $dice[] = ['type' => "orangeP", "type_arg" => 0, "nbr" => 3];
        $dice[] = ['type' => "tealP", "type_arg" => 0, "nbr" => 3];
        $dice[] = ['type' => "blueT", "type_arg" => 0, "nbr" => 9];
        $dice[] = ['type' => "greenT", "type_arg" => 0, "nbr" => 8];
        $dice[] = ['type' => "orangeT", "type_arg" => 0, "nbr" => 7];
        $this->dice->createCards($dice);

        $colourNames = [
            "blue" => "488fc7",
            "green" => "69ba35",
            "red" => "ad3545",
            "teal" => "439ba0",
            "orange" => "cb5c21", 
        ];
        foreach (["blueP", "greenP", "redP", "orangeP", "tealP"] as $type) {
            foreach ($this->dice->getCardsOfType($type) as $curDice) {
                $colour = substr($type, 0, strpos($type, "P"));
                $playerId = -1;
                foreach($this->loadPlayersBasicInfos() as $id => $info) {
                    $curColour = $info['player_color'];
                    if ($colourNames[$colour] == $curColour) {
                        $playerId = $id;
                    }
                }

                if ($playerId != -1) {
                    $this->dice->moveCard($curDice["id"], "spent", $playerId);
                } else {
                    $this->dice->moveCard($curDice["id"], "OOP");
                }
            }
        }
        $this->dice->shuffle("deck");

        // Everything for fish setup
        $fish1 = [];
        $fish2 = [];
        $fish3 = [];
        $count = 0;

        foreach ($this->lists->getFish() as $curFish) {
            $temp = ['type' => $count, 'type_arg' => 0, 'nbr' => 1];
            switch ($curFish->getDepth()) {
                case 1:
                    $fish1[] = $temp;
                    break;
                case 2:
                    $fish2[] = $temp;
                    break;
                case 3:
                    $fish3[] = $temp;
                    break;
            }
            $count++;
        }

        $this->fish->createCards($fish1, "depth1");
        $this->fish->createCards($fish2, "depth2");
        $this->fish->createCards($fish3, "depth3");

        $this->fish->shuffle("depth1");
        $this->fish->shuffle("depth2");
        $this->fish->shuffle("depth3");

        for ($i = 1; $i <= 3; $i++) {
            for ($j = 1; $j <= 3; $j++) {
                $shoalNum = ($i - 1) * 3 + $j;
                $this->fish->pickCardsForLocation(13, "depth$i", "shoal_$shoalNum", 0);
                $this->fish->shuffle("shoal_$shoalNum");
            }
        }

        $allFish = $this->getObjectListFromDB("SELECT `card_id`, `card_location` FROM `fish`");
        foreach ($allFish as $fish) {
            $id = $fish['card_id'];
            $newArg = substr($fish['card_location'], 6);
            $this->DbQuery("UPDATE `fish` SET `card_type_arg` = $newArg WHERE `card_id` = $id");
        }
        
        // Everything for regret setup
        $regrets = [];
        $regretNums = [0, 0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 1, 1, 1, 0, 1, 1, 1, 2, 3, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 3, 3, 3, 2, 2];

        for ($i = 1; $i <= 60; $i++) {
            $regrets[] = ['type' => $i, 'type_arg' => $regretNums[$i - 1], 'nbr' => 1];
        }
        $this->regrets->createCards($regrets, 'deck');
        $this->regrets->shuffle('deck');

        // Everything for reels setup
        $reels = [];
        $i = 0;
        foreach ($this->lists->getReels() as $reel) {
            $reels[] = ["type" => $i, "type_arg" => $i, "nbr" => 1];
            $i++;
        }
        $this->reels->createCards($reels, 'deck');
        $this->reels->shuffle("deck");
        
        // Everything for rods setup
        $rods = [];
        $i = 0;
        foreach ($this->lists->getRods() as $rod) {
            $rods[] = ["type" => $i, "type_arg" => $i, "nbr" => 1];
            $i++;
        }
        $this->rods->createCards($rods, 'deck');
        $this->rods->shuffle("deck");
        
        // Everything for supplies setup
        $supplies = [];
        $i = 0;
        foreach ($this->lists->getReels() as $supply) {
            $supplies[] = ["type" => $i, "type_arg" => $i, "nbr" => 1];
            $i++;
        }
        $this->supplies->createCards($supplies, 'deck');
        $this->supplies->shuffle("deck");

        // Everything for dinks setup
        $dinks = [];
        $i = 0;
        foreach ($this->lists->getDinks() as $dink) {
            $dinks[] = ["type" => $i, "type_arg" => $i, "nbr" => 1];
            $i++;
        }
        $this->dinks->createCards($dinks, "deck");
        $this->dinks->shuffle("deck");

        // Init game statistics.
        //
        // NOTE: statistics used in this file must be defined in your `stats.inc.php` file.

        // Dummy content.
        // $this->tableStats->init('table_teststat1', 0);
        // $this->playerStats->init('player_teststat1', 0);

        // TODO: Finish setup: Regrets, Items, Dinks, Fish

        // Activate first player once everything has been initialized and ready.
        $this->activeNextPlayer();
        $this->globals->set("firstPlayer", $this->getActivePlayerId());
        return Start::class;
    }

    #[CheckAction(false)]
    public function actChooseSide(string $curPlayer) {
        $curSide = $this->getUniqueValueFromDB("SELECT `playerBoard` FROM `player` WHERE `player_id` = $curPlayer");
        $curSide == "monster" ? $newSide = "human" : $newSide = "monster";
        $this->DbQuery("UPDATE `player` SET `playerBoard` = '$newSide' WHERE `player_id` = $curPlayer");

        $this->notify->all("playerBoardSide", "", ["player_id" => $curPlayer,"newSide" => $curSide]);
    }

    /**
     * Example of debug function.
     * Here, jump to a state you want to test (by default, jump to next player state)
     * You can trigger it on Studio using the Debug button on the right of the top bar.
     */
    public function debug_goToState(int $state = 3) {
        $this->gamestate->jumpToState($state);
    }

    /**
     * Another example of debug function, to easily test the zombie code.
     */
    public function debug_playAutomatically(int $moves = 50) {
        $count = 0;
        while (intval($this->gamestate->getCurrentMainStateId()) < 99 && $count < $moves) {
            $count++;
            foreach($this->gamestate->getActivePlayerList() as $playerId) {
                $playerId = (int)$playerId;
                $this->gamestate->runStateClassZombie($this->gamestate->getCurrentState($playerId), $playerId);
            }
        }
    }

    /*
    Another example of debug function, to easily create situations you want to test.
    Here, put a card you want to test in your hand (assuming you use the Deck component).

    public function debug_setCardInHand(int $cardType, int $playerId) {
        $card = array_values($this->cards->getCardsOfType($cardType))[0];
        $this->cards->moveCard($card['id'], 'hand', $playerId);
    }
    */
}
