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
            description: clienttranslate('${actplayer} is viewing what they bought'),
            descriptionMyTurn: clienttranslate('${you} are viewing what you bought'),
            transitions: ["" => 41],
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        $shop = $this->globals->get("curShop");
        $methodText = "get" . strtoupper(substr($shop, 0, 1)) . substr($shop, 1);
        return [
            "_private" => [
                $activePlayerId => [
                    "reveal" => array_map(fn($item) => ["name" => $this->game->lists->$methodText()[$item["type"]]->getName(), "type" => $item["type"], "id" => $item["id"]], 
                                            array_values($this->game->$shop->getCardsInLocation("reveal")))
                ]
            ],
            "shop" => $shop,
            "num" => count($this->game->$shop->getCardsInLocation("reveal"))
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

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}