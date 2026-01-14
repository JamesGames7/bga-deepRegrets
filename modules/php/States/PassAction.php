<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * Action done when a player is passed
 * 
 * 1. When a player passes or on each of their following turns this triggers
 * 
 * 2. Can either take a dink or discard a random regret
 * 
 * 3. Moves to next player state
 */
// TODO: Correct values
class PassAction extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 45,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must choose a passing reward'),
            descriptionMyTurn: clienttranslate('${you} must choose a passing reward'),
            transitions: ["nextPlayer" => 49], // LINK - modules\php\States\NextPlayer.php
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
    }   

    #[PossibleAction]
    function actDiscard (int $activePlayerId, int $id) {
        // TODO make discard work on reload - not saving in discard
        if ($id >= 0) {
            $this->game->regrets->insertCardOnExtremePosition($id, "discard", true);
            $this->notify->all("discardRegret", '${player_name} discards a regret', [
                "regret" => $id,
                "location" => $this->game->regrets->getCard($id),
                "player_name" => $this->game->getActivePlayerName(),
                "player_id" => $activePlayerId
            ]);
            return "nextPlayer";
        } else {
            throw new \BgaUserException("Must select a regret to discard");
        }
    }

    #[PossibleAction]
    function actDraw (int $activePlayerId) {
        $card = $this->game->dinks->getCardOnTop("deck");
        $passCard = ["id" => intval($card["id"]), "type" => $this->game->lists->getDinks()[$card["type"]]->getCoords()];
        $this->game->dinks->pickCard("deck", $activePlayerId);

        $this->notify->all("drawDink", '${player_name} drew a dink', [
            "player_name" => $this->game->getActivePlayerName(),
            "player_id" => $activePlayerId,
            "_private" => [
                $activePlayerId => [
                    $passCard
                ]
            ]
        ]);

        return "nextPlayer";
    }

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}