<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

class ShopReveal extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 46,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} is viewing the shop\'s wares'),
            descriptionMyTurn: clienttranslate('${you} are viewing the shop\'s wares'),
            transitions: ["" => 41],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        if ($this->globals->get("curShop") == "dice" && !$this->globals->get("diceRolled")) {
            foreach ($this->game->dice->getCardsInLocation("reveal") as $id => $dice) {
                $rand = \bga_rand(0, 3);
                $this->game->DbQuery("UPDATE `dice` SET `card_type_arg` = $rand WHERE `card_id` = '$id'");
            }
            $this->globals->set("diceRolled", true);
        }


        $shop = $this->globals->get("curShop");
        $methodText = "get" . strtoupper(substr($shop, 0, 1)) . substr($shop, 1);

        if ($shop != "dice") {
            $reveal = array_map(fn($item) => ["name" => $this->game->lists->$methodText()[$item["type"]]->getName(), "type" => $item["type"], "id" => $item["id"]], 
                                            array_values($this->game->$shop->getCardsInLocation("reveal")));
        } else {
            $reveal = array_map(fn($dice) => ["id" => $dice["id"], "type" => $dice["type"], "type_arg" => $dice["type_arg"]], array_values($this->game->dice->getCardsInLocation("reveal")));
        }

        return [
            "_private" => [
                $activePlayerId => [
                    "reveal" => $reveal,
                ]
            ],
            "shop" => $shop,
            "num" => count($this->game->$shop->getCardsInLocation("reveal")),
            "freshSize" => intval($this->game->dice->countCardsInLocation("fresh", $activePlayerId)),
            "maxFresh" => $this->game->REGRET_DICE[min(13, intval($this->game->regrets->countCardsInLocation("hand", $activePlayerId)))]
        ];
    } 

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
    }   

    #[PossibleAction]
    function actBuyCards(int $activePlayerId, string $cards) {
        // FIXME check number of fishbucks
        $cards = json_decode($cards);
        $shop = $this->globals->get("curShop");
        $num = count($this->game->$shop->getCardsInLocation("reveal"));
        $funcShop = "get" . strtoupper(substr($shop, 0, 1)) . substr($shop, 1);
        if ($num == 1 && count($cards) == 1
        || $num == 3 && ((count($cards) == 1 && ($shop == "reels" || $shop == "rods")) || (count($cards) == 2 && $shop == "supplies"))
        || $num == 5 && ((count($cards) == 2 && ($shop == "reels" || $shop == "rods")) || (count($cards) == 3 && $shop == "supplies"))) {
            $this->game->$shop->moveCards(array_map(fn($card) => $card->id, $cards), "hand", $activePlayerId);
            $this->game->$shop->moveAllCardsInLocation("reveal", "deck");
            $this->game->$shop->shuffle("deck");
            $this->notify->all("buyCards", '${player_name} got ${num} ${shop}', [
                "player_name" => $this->game->getActivePlayerName(),
                "player_id" => $activePlayerId,
                "cards" => array_map(fn($card) => ["name" => $this->game->lists->$funcShop()[$card->type]->getName(), "type" => $card->type], $cards),
                "shop" => $shop,
                "num" => count($cards)
            ]);
            $this->globals->set("actionComplete", true);
            return "";
        } else {
            throw new \BgaUserException("Incorrect number of cards selected");
        }
    }

    #[PossibleAction]
    function actChooseDice(int $activePlayerId, string $diceJSON) {
        $total = $this->game->dice->getCardsInLocation("reveal");
        $allDice = json_decode($diceJSON);
        $newDice = $this->getArgs($activePlayerId)["maxFresh"] - $this->getArgs($activePlayerId)["freshSize"];
        if (count($allDice) <= $newDice) {
            foreach (array_map(fn($item) => $this->game->dice->getCard($item), $allDice) as $die) {
                $this->notify->all("test", '', [$die["id"]]);
                $this->game->dice->moveCard(intval($die["id"]), "fresh", $activePlayerId);
            }
            $spent = $this->game->dice->getCardsInLocation("reveal");
            $this->game->dice->moveAllCardsInLocation("reveal", "spent", null, $activePlayerId);

            $this->notify->all("chooseFresh", '${player_name} got ${num} dice', [
                "player_name" => $this->game->getActivePlayerName(),
                "player_id" => $activePlayerId,
                "num" => $total,
                "spent" => array_values($spent),
                "fresh" => array_map(fn($item) => $this->game->dice->getCard($item), $allDice)
            ]);
            $this->globals->set("diceRolled", false);
            $this->globals->set("actionComplete", true);
            return "";
        } else {
            throw new \BgaUserException("You must select $newDice dice");
        }
    }

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}