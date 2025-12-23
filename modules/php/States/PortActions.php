<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

use function PHPSTORM_META\type;

/**
 * Possible actions at the port - 1-2 notification(s)
 * 
 * 1. Player can choose which action to perform or to pass
 * 
 * 2. Performs that action - could involve choosing cards and thus +1 notification: client states
 * 
 * 3. Move to next player state
 */
// TODO: Correct values
class PortActions extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 41,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must perform Port actions or pass'),
            descriptionMyTurn: clienttranslate('${you} must perform Port actions or pass'),
            transitions: ["pass" => 45, "nextPlayer" => 49], // LINK - modules\php\States\PassAction.php
                                                             // LINK - modules\php\States\NextPlayer.php
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        $shops = json_decode($this->game->getUniqueValueFromDB("SELECT `shops` FROM `player` WHERE player_id = $activePlayerId"));
        return [
            "reels" => $shops->reels,
            "rods" => $shops->rods,
            "supplies" => $shops->supplies,
            "dice" => $shops->dice,
            "curFishbucks" => intval($this->game->getUniqueValueFromDB("SELECT `fishbucks` FROM `player` WHERE player_id = $activePlayerId")),
            "newFishbucks" => 0,
            "madness" => min($this->game->regrets->countCardsInLocation("hand", $activePlayerId), 13),
            "display" => 0,
            "num" => 0,
            "actionComplete" => $this->globals->get("actionComplete")
        ];
    } 

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    #[PossibleAction]
    function actShop(string $shop) {
        
    }

    #[PossibleAction]
    function actSell(string $fish, int $activePlayerId) {
        $json_fish = json_decode($fish);
        $total = 0;
        $num = 0;
        $cards = [];
        foreach ($json_fish as $curFish) {
            $singleFish = array_filter($this->game->lists->getFish(), function($f) use($curFish) {return $curFish->id == $f->getName();});
            $fishData = array_values($singleFish)[0];
            $sellValue = $fishData->getSellValue();
            $madness = $this->getArgs($activePlayerId)["madness"];
            $regretMod = $this->game->REGRET_MODIFIERS[$madness][$fishData->getType()];

            $total += max($sellValue + $regretMod, 0);

            $cards[] = $fishData->getName();
            
            $this->game->fish->moveCard(array_keys($this->game->fish->getCardsOfType(strval(array_keys($singleFish)[0])))[0], "discard", $fishData->getDepth());
            $num++;
        }
        $total = min($total, 10 - $this->getArgs($activePlayerId)["curFishbucks"]) + $this->getArgs($activePlayerId)["curFishbucks"];
        $inc = $total - $this->getArgs($activePlayerId)["curFishbucks"];
        
        $this->game->DbQuery("UPDATE `player` SET `fishbucks` = $total WHERE `player_id` = $activePlayerId");

        $this->notify->all("sellFish", '${player_name} sold ${num} fish for ${fishbucks} fishbucks', [
            "player_name" => $this->game->getActivePlayerName(),
            "player_id" => $activePlayerId,
            "num" => $num,
            "fishbucks" => $inc,
            "total" => $total,
            "ids" => $cards
        ]);
    }

    #[PossibleAction]
    function actMount(int $fishId) {
        
    }

    #[PossibleAction]
    function actPass() {
        return "pass";
    }

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}