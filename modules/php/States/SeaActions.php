<?php

declare(strict_types=1);

namespace Bga\Games\DeepRegrets\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\DeepRegrets\Game;

/**
 * Possible actions at sea - 1+ notification(s)
 * 
 * 1. Player can choose which action to perform *(fish or abandon ship)* or to pass
 * 
 * 2. Performs that action - fishing may take multiple notifications: client states
 * 
 * 3. Move to next player state
 */
class SeaActions extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 42,
            type: StateType::ACTIVE_PLAYER,

            // optional
            description: clienttranslate('${actplayer} must perform Sea actions or pass'),
            descriptionMyTurn: clienttranslate('${you} must perform Sea actions or pass'),
            transitions: ["port" => 41, "pass" => 45, "nextPlayer" => 49], // LINK - modules\php\States\PassAction.php
                                                                           // LINK - modules\php\States\NextPlayer.php
            updateGameProgression: false,
            initialPrivate: null,
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        // the data sent to the front when entering the state
        return [
            "depth" => $this->game->getUniqueValueFromDB("SELECT `depth` FROM `player` WHERE `player_id` = $activePlayerId"), 
            "casted" => $this->globals->get("casted"),
            "selectedShoal" => $this->globals->get("curShoal"),
            "lifeboat" => json_decode($this->game->getUniqueValueFromDB("SELECT `provisions` FROM `player` WHERE `player_id` = $activePlayerId"))->lifeboat
        ];
    } 

    #[PossibleAction]
    function actCast(string $shoal, int $activePlayerId) {
        $shoal = explode("|", $shoal);
        $shoalNum = ($shoal[0] - 1) * 3 + $shoal[1];
        if (!$this->globals->get("casted")) {
            $this->globals->set("casted", true);
            $this->globals->set("curShoal", $shoalNum);
            $this->notify->all("selectedShoal", '${player_name} has selected to fish in a shoal of depth ${depth}', [
                "player_id" => $activePlayerId,
                "player_name" => $this->game->getPlayerNameById($activePlayerId),
                "depth" => $shoal[0],
                "shoal" => $shoal
            ]);
			$revealed = $this->globals->get("revealedShoals");
            if (!$revealed[$shoalNum - 1]) {
				$fish = $this->game->fish->getCardOnTop("shoal_$shoalNum");
				$revealed[$shoalNum - 1] = true;
				$this->notify->all("revealCard", '${player_name} flips over the top card of a shoal of depth ${depth}', [
					"player_id" => $activePlayerId,
					"player_name" => $this->game->getPlayerNameById($activePlayerId),
					"depth" => $shoal[0],
					"shoal" => $shoal,
					"shoalNum" => $shoalNum,
					"fish" => $this->game->lists->getFish()[$fish["type"]]->getData(),
					"revealed" => $revealed
				]);
				$this->globals->set("revealedShoals", $revealed);
            }
            // TODO add fish power on reveal
        } else {
            throw new \BgaUserException("Can only cast once per turn");
        }
    }

    #[PossibleAction]
    function actFinishFish() {
        if ($this->globals->get("casted")) {
            $shoal = $this->globals->get("curShoal");
        } else {
            throw new \BgaUserException("Can only fish after casting");
        }
    }

    #[PossibleAction]
    function actAbandonShip(int $activePlayerId) {
        $provisions = json_decode($this->game->getUniqueValueFromDB("SELECT `provisions` FROM `player` WHERE `player_id` = $activePlayerId"));
        if (!$this->globals->get("casted") && $provisions->lifeboat == "true") {
            $provisions->lifeboat = false;
            $provisions = json_encode($provisions);

            $this->game->DbQuery("UPDATE `player` SET `location` = 'port', `depth` = 1, `provisions` = '$provisions' WHERE `player_id` = $activePlayerId");
            $this->notify->all("abandonedShip", '${player_name} abandoned ship', [
                "player_name" => $this->game->getActivePlayerName(),
                "player_id" => $activePlayerId
            ]);
            
            return "port";
        } else {
            throw new \BgaUserException("Must abandon ship before casting");
        }
    }

    #[PossibleAction]
    function actPass() {
        if (!$this->globals->get("casted")) {

        } else {
            throw new \BgaUserException("Must pass before casting");
        }
    }

    #[PossibleAction]
    function actDropSinker() {
        if (!$this->globals->get("casted")) {

        } else {
            throw new \BgaUserException("Must drop sinker before casting");
        }
    }

    #[PossibleAction]
    function actCanOfWorms() {
        if (!$this->globals->get("casted")) {

        } else {
            throw new \BgaUserException("Must use Can Of Worms before casting");
        }
    }

    #[PossibleAction]
    function actEatFish() {
        
    }

    #[PossibleAction]
    function actUseItems() {
        
    }

    function onEnteringState(int $activePlayerId) {
        // the code to run when entering the state
        if ($this->game->dice->countCardsInLocation("fresh", $activePlayerId) == 0) {
            return "pass";
        }

        $this->globals->set("casted", false);
    }   

    function zombie(int $playerId): string {
        // the code to run when the player is a Zombie
        return "";
    }
}