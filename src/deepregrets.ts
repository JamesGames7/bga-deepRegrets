/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * DeepRegrets implementation : © Connor Rask connor@srask.ca
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

 // @ts-ignore
GameGui = (function () { // this hack required so we fake extend GameGui
    function GameGui() {}
    return GameGui;
})();

// Note: it does not really extend it in es6 way, you cannot call super you have to use dojo way 
class DeepRegrets extends GameGui<DeepRegretsGamedatas> { 
	// * Definitions
	public animationManager: any;
	public diceManager: any;
	public dinksManager: any;
	public seaCardManager: any;
	public regretManager: any;
	public reelsManager: any;
	public rodsManager: any;
	public suppliesManager: any;
	public shipsManager: any;
	public regretDeck = {};
	public regretDiscard = {};
	public freshStock = {};
	public revealStock: any;
	public spentStock = {};
	public shoalStocks: any[][] = [];
	public graveyardStocks: any[] = [];
	public fishHandStock: any;
	public reelHandStock: any;
	public rodHandStock: any;
	public regretHandStock: any;
	public dinkHandStock: any;
	public supplyHandStock: any;
	public reelsDeck = {};
	public rodsDeck = {};
	public suppliesDeck = {};
	public shipDecks: any[] = [];
	public dinkDeck = {};
	public mountingSlots = {};
	public newMounted = [];
	public clearedSpots = [];
	public actionComplete = false;

	private COLOUR_POSITION = {
		"488fc7": 0,
		"69ba35": -100,
		"ad3545": -200,
		"439ba0": -300,
		"cb5c21": -400
	}
	private DICE_POSITION = {
		"blueP": 0, 
		"blueT": -100, 
		"greenP": -200, 
		"greenT": -300, 
		"omen": -400, 
		"redP": -500, 
		"tealP": -600, 
		"orangeP": -700, 
		"orangeT": -800
	}
	private SHOAL_SIZE = {
		"small": 0,
		"middling": 1,
		"large": 2
	}
	private MADNESS_LEVEL = [
		0, 
		1, 1, 1,
		2, 2, 2,
		3, 3, 3,
		4, 4, 4,
		5
	]
	private DICE_VALUE = {
		"blueP": [1, 1, 2, 3],
		"greenP": [1, 1, 2, 3],
		"redP": [1, 1, 2, 3],
		"tealP": [1, 1, 2, 3],
		"orangeP": [1, 1, 2, 3],
		"greenT": [1, 1, 2, 3],
		"blueT": [0, 0, 1, 2],
		"orangeT": [2, 3, 2, 3],
		"omen": [1, 2, 3, 4]
	}
	private REGRET_VALUES = {
		0: {"fair": 2, "foul": -2},
		1: {"fair": 1, "foul": -1},
		2: {"fair": 1, "foul": -1},
		3: {"fair": 1, "foul": -1},
		4: {"fair": 1, "foul": 0},
		5: {"fair": 1, "foul": 0},
		6: {"fair": 1, "foul": 0},
		7: {"fair": 0, "foul": 1},
		8: {"fair": 0, "foul": 1},
		9: {"fair": 0, "foul": 1},
		10: {"fair": -1, "foul": 1},
		11: {"fair": -1, "foul": 1},
		12: {"fair": -1, "foul": 1},
		13: {"fair": -2, "foul": 2},
	}

	constructor() {
		// @ts-ignore
		super();
	}
	
	public setup(gamedatas: any) {
		this.setupNotifications();

		$("game_play_area").insertAdjacentHTML("beforeend", `
			<div id="boards"></div>
			<div id="playerBoards"></div>
			<div id="lineGrid"></div>
		`)

		$('boards').insertAdjacentHTML("beforeend", `
				<div id="sea_board" style="zoom: ${localStorage.getItem("sea_board") || (($("boards").clientWidth / 726) > 1 ? $("boards").clientWidth / 726 : 1)}">
					<div class="size_buttons">
						<div id="sea_home" class="utility_button"></div>
						<div id="sea_large" class="utility_button"></div>
						<div id="sea_small" class="utility_button"></div>
					</div>
					<div id="shoal_grid">
						<div class="shoal" id="shoal_1_1"></div>
						<div class="shoal" id="shoal_1_2"></div>
						<div class="shoal" id="shoal_1_3"></div>
						<div class="shoal" id="shoal_1_graveyard"></div>
						<div class="shoal" id="shoal_2_1"></div>
						<div class="shoal" id="shoal_2_2"></div>
						<div class="shoal" id="shoal_2_3"></div>
						<div class="shoal" id="shoal_2_graveyard"></div>
						<div class="shoal" id="shoal_3_1"></div>
						<div class="shoal" id="shoal_3_2"></div>
						<div class="shoal" id="shoal_3_3"></div>
						<div class="shoal" id="shoal_3_graveyard"></div>
					</div>
					<div id="ship_grid_sea">
						<div id="ship_grid_1" class="ship_depth"></div>
						<div id="ship_grid_2" class="ship_depth"></div>
						<div id="ship_grid_3" class="ship_depth"></div>
					</div>
					<div id="dink_deck"></div>
				</div>
				<div id="port_board" style="zoom: ${localStorage.getItem("port_board") || (($("boards").clientWidth / 1500) > 1 ? $("boards").clientWidth / 1500 : 1)}">
					<div class="size_buttons">
						<div id="port_home" class="utility_button"></div>
						<div id="port_large" class="utility_button"></div>
						<div id="port_small" class="utility_button"></div>
					</div>
					<div id="regret_grid">
						<div class="regret" id="regretDeck"></div>
						<div class="regret" id="regretDiscard"></div>
					</div>
					<div id="reelsDeck" class="itemDeck"></div>
					<div id="rodsDeck" class="itemDeck"></div>
					<div id="suppliesDeck" class="itemDeck"></div>
					<div id="ship_port"></div>
				</div>			
		`)

		document.querySelectorAll(".utility_button").forEach(button => {
			let boards = $("boards");
			let id: string = button.id;
			let boardWidth: number;
			switch (id.substring(0, 1)) {
				case "s":
					boardWidth = 726;
					break;
				case "p":
					boardWidth = 1740;
					break;
			}
			button.addEventListener("click", () => {
				let board: HTMLElement = $(id.substring(0, id.indexOf("_")) + "_board");
				let curZoom: number = parseFloat((getComputedStyle(board) as any).zoom);
				let newZoom: number;
				switch (id.substring(id.indexOf("_") + 1)) {
					case "home":
						let temp = Math.floor((boards.clientWidth / boardWidth) * 10) / 10;
						temp > 1 ? newZoom = 1 : newZoom = temp;
						break;
					case "large":
						curZoom = Math.floor(curZoom * 10) / 10;
						curZoom + 0.1 < Math.ceil((boards.clientWidth / boardWidth) * 10) / 10 ? newZoom = curZoom + 0.1 : newZoom = curZoom;
						break;
					case "small":
						curZoom = Math.floor(curZoom * 10) / 10;
						curZoom > 0.1 ? newZoom = curZoom - 0.1 : newZoom = curZoom;
						break;
				}
				localStorage.setItem(board.id, newZoom.toString());
				(board.style as any).zoom = newZoom.toString();
			});
		});

		window.addEventListener("resize", () => {
			let port = $("port_board");
			let boards = $("boards");

			if (1720 * (port.style as any).zoom + 20 > boards.clientWidth) {
				(port.style as any).zoom = boards.clientWidth / 1760;
			}
		});

		// create the animation manager, and bind it to the `game.bgaAnimationsActive()` function
        this.animationManager = new BgaAnimations.Manager({
            animationsActive: () => this.bgaAnimationsActive(),
        });

        // create the card manager
        this.seaCardManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'fish',
            getId: (card) => (card as any).id || (card as any).name,
			cardWidth: 156,
			cardHeight: 215,
			isCardVisible(card: {coords}) {
				return card.coords[0] != -1;
			},
			fakeCardGenerator(deckId: string) {
				return cardTemplate("fake", "small", 0)
			},
			setupDiv: (card, div) => {
				div.dataset.type = (card as any).type;
				div.dataset.depth = (card as any).depth;
				if ((card as any).id == "fake") {
					div.classList.add("removed");
				}
			},
			setupBackDiv: (card: {size, depth}, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/seaBacks.png)`
				div.style.backgroundSize = "300% 300%";
				div.style.borderRadius = `6px`;
				let size = typeof card.size == "number" ? card.size : this.SHOAL_SIZE[card.size];
				div.style.backgroundPositionX = `-${size}00%`;
				div.style.backgroundPositionY = `-${card.depth - 1}00%`;
                this.addTooltipHtml(div.id, `Fish in a shoal<br><strong>Depth:</strong> ${card.depth}<br><strong>Size:</strong> ${toTitleCase(Object.keys(this.SHOAL_SIZE).find(key => this.SHOAL_SIZE[key] === size))}`);
			},
            setupFrontDiv: (card: {coords: [number, number], name: any, size: any, depth: any, type: any, sell: any, difficulty: any}, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/seaCards.png)`
				div.style.backgroundSize = "1300% 900%";
				div.style.borderRadius = `6px`;
				if (card.coords[0] > -1) {
					div.style.backgroundPositionX = `-${card.coords[0]}00%`;
					div.style.backgroundPositionY = `-${card.coords[1]}00%`;
				}
                this.addTooltipHtml(div.id, frontTooltipFish(card.coords, card.name, card.size, card.depth, card.type, card.sell, card.difficulty));
            },
			selectableCardStyle: {class: "selectable"},
			selectedCardStyle: {class: "selected"}
        });

        // create the dice manager
        this.diceManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'dice',
            getId: (dice) => (dice as any).id,
			cardWidth: 95 / 2,
			cardHeight: 132 / 2,
			isCardVisible: (card: any) => true,
			setupDiv: (dice, div) => {
				div.dataset.type = (dice as any).type;
				div.dataset.typeArg = (dice as any).type_arg;
			},
            setupFrontDiv: (dice, div) => {
				div.style.backgroundPositionX = `${this.DICE_POSITION[(dice as any).type]}%`; 
				div.style.backgroundPositionY = `-${(dice as any).type_arg}00%`;
				div.style.backgroundSize = "900% 400%";
                this.addTooltipHtml(div.id, `Dice in ${(dice as any).location} pool`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/dice/sides.jpg)`;
            },
			selectableCardStyle: {class: "selectable"},
			selectedCardStyle: {class: "selected"}
        });

        // create the regrets manager
        this.regretManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'regrets',
            getId: (card: any) => card.id,
			cardWidth: 278,
			cardHeight: 396,
			setupDiv: (card: any, div) => {
				div.dataset.type = card.type;
				div.dataset.typeArg = card.type_arg;
			},
			setupBackDiv: (card: any, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/regrets.png)`;
				div.style.backgroundPosition = `0 0`;
				div.style.backgroundSize = "1000% 700%";
				div.style.borderRadius = `12px`;
			},
            setupFrontDiv: (card: any, div) => {
				div.style.backgroundPositionX = `-${card.type % 10}00%`; 
				div.style.backgroundPositionY = `-${Math.floor(card.type / 10)}00%`;
				div.style.backgroundSize = "1000% 700%";
				div.style.borderRadius = `12px`;
                this.addTooltipHtml(div.id, `Regret of magnitude ${card.type_arg}`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/regrets.png)`;
            },
			selectableCardStyle: {class: "selectable"},
			selectedCardStyle: {class: "selected"},
        });

		// create the rods / reels / supplies managers
        this.reelsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'reels',
            getId: (card: any) => card.name,
			cardWidth: 350,
			cardHeight: 490,
			setupDiv: (card: any, div) => {
				div.dataset.type = card.type;
			},
			setupBackDiv: (card: any, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/reels.png)`;
				div.style.backgroundPosition = `0 0`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
			},
            setupFrontDiv: (card: any, div) => {
				div.style.backgroundPositionX = `-${(parseInt(card.type) + 1) % 5}00%`; 
				div.style.backgroundPositionY = `-${Math.floor((parseInt(card.type) + 1) / 5)}00%`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
				// TODO add effect description
                this.addTooltipHtml(div.id, `
					<div class="itemTooltipGrid">
						<div class="itemTooltipImg reels" style="background-position: ${div.style.backgroundPosition}"></div>
						<div class="itemTooltipText">
							<div><strong>Name:</strong> ${card.name}</div>
						</div>
					</div>
				`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/reels.png)`;
            },
			selectableCardStyle: {class: "selectable"},
			selectedCardStyle: {class: "selected"}
        });		

        this.rodsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'rods',
            getId: (card: any) => card.name,
			cardWidth: 350,
			cardHeight: 490,
			setupDiv: (card: any, div) => {
				div.dataset.type = card.type;
				div.dataset.typeArg = card.type_arg;
			},
			setupBackDiv: (card: any, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/rods.png)`;
				div.style.backgroundPosition = `0 0`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
			},
            setupFrontDiv: (card: any, div) => {
				div.style.backgroundPositionX = `-${(parseInt(card.type) + 1) % 5}00%`; 
				div.style.backgroundPositionY = `-${Math.floor((parseInt(card.type) + 1) / 5)}00%`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
				// TODO add effect description
                this.addTooltipHtml(div.id, `
					<div class="itemTooltipGrid">
						<div class="itemTooltipImg rods" style="background-position: ${div.style.backgroundPosition}"></div>
						<div class="itemTooltipText">
							<div><strong>Name:</strong> ${card.name}</div>
						</div>
					</div>
				`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/rods.png)`;
            },
			selectableCardStyle: {class: "selectable"},
			selectedCardStyle: {class: "selected"}
        });	
		
        this.suppliesManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'supplies',
            getId: (card: any) => card.name,
			cardWidth: 350,
			cardHeight: 490,
			setupDiv: (card: any, div) => {
				div.dataset.type = card.type;
				div.dataset.typeArg = card.type_arg;
			},
			setupBackDiv: (card: any, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/supplies.png)`;
				div.style.backgroundPosition = `0 0`;
				div.style.backgroundSize = "600% 400%";
				div.style.borderRadius = `12px`;
			},
            setupFrontDiv: (card: any, div) => {
				div.style.backgroundPositionX = `-${(parseInt(card.type) + 1) % 6}00%`; 
				div.style.backgroundPositionY = `-${Math.floor((parseInt(card.type) + 1) / 6)}00%`;
				div.style.backgroundSize = "600% 400%";
				div.style.borderRadius = `12px`;
				// TODO add effect description
                this.addTooltipHtml(div.id, `
					<div class="itemTooltipGrid">
						<div class="itemTooltipImg supplies" style="background-position: ${div.style.backgroundPosition}"></div>
						<div class="itemTooltipText">
							<div><strong>Name:</strong> ${card.name}</div>
						</div>
					</div>
				`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/supplies.png)`;
            },
			selectableCardStyle: {class: "selectable"},
			selectedCardStyle: {class: "selected"}
        });			

		// create the ships manager
		this.shipsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'ships',
            getId: (ship: any) => ship.id,
			cardWidth: 57,
			cardHeight: 38,
			isCardVisible: (card) => true,
			setupDiv: (ship: any, div) => {
				div.dataset.type = ship.type;
				div.dataset.typeArg = ship.type_arg;
				div.style.boxShadow = "none";
			},
            setupFrontDiv: (ship: any, div) => {
				div.style.backgroundPositionX = `0`;
				div.style.backgroundPositionY = `${ship.colour}%`
				div.style.backgroundSize = "100% 500%";
				div.style.boxShadow = "none";
                this.addTooltipHtml(div.id, `Ship`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/other/boats.png)`;
            },
        });	

		// create the dinks manager
		this.dinksManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'dinks',
            getId: (dink: any) => dink.id,
			cardWidth: 103,
			cardHeight: 147,
			isCardVisible: (card) => typeof card.id == "number",
			setupDiv: (dink: any, div) => {
				// div.dataset.type = dink.type;
				// div.dataset.typeArg = dink.type_arg;
			},
			setupBackDiv: (dink: any, div) => {
				div.style.backgroundPosition = `0 0`;
				div.style.backgroundSize = "700% 400%";
				div.style.backgroundImage = `url(${g_gamethemeurl}img/dinks.png)`;
				div.style.borderRadius = "5px";
			},
            setupFrontDiv: (dink: any, div) => {
				div.style.backgroundSize = "700% 400%";
				if (dink.type) {
					div.style.backgroundPositionX = `-${dink.type[0]}00%`;
					div.style.backgroundPositionY = `-${dink.type[1]}00%`;
				}
				div.style.boxShadow = "none";
                this.addTooltipHtml(div.id, `Dink`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/dinks.png)`;
				div.style.borderRadius = "5px";
            },
        });	

		// Ship stock setup
		for (let i = 0; i < 4; i++) {
			let el;
			if (i == 0) {
				el = $("ship_port");
			} else {
				el = $(`ship_grid_${i}`);
			}
			this.shipDecks.push(new BgaCards.LineStock(this.shipsManager, el, {direction: "column", wrap: "nowrap"}));
		}
		// Madness board setup
		$("game_play_area").insertAdjacentHTML("afterend", `
			<div id="madness_board">
				<div id="tinyMadness" class="tiny"></div>
				<div id="largeMadness" class="tiny">
					<div id="madnessGrid"></div>
				</div>
			</div>
		`);
		let mGrid = $("madnessGrid");
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 5; j++) {
				mGrid.insertAdjacentHTML("beforeend", `<div id="madness_${i}_${j}" class="madnessSlot madness_${j}"></div>`)
			}
		}
		let el = $("madness_board");
		el.style.left = "115px";
		el.addEventListener("click", () => {
			Array.from(el.children).forEach(child => {
				if (child.classList.contains("tiny")) {
					child.classList.remove("tiny");
					child.classList.add("large");
				} else {
					child.classList.remove("large");
					child.classList.add("tiny");
				}
				
			});
		});

		let playerOrder = [gamedatas.players[this.player_id]];
		let id = gamedatas.playerOrder[this.player_id];
		while (id != this.player_id) {
			playerOrder.push(gamedatas.players[id]);
			id = gamedatas.playerOrder[id];
		}


		playerOrder.forEach(player => {
			let id: string = `playerBoard-${player["id"]}`;
			let colour: string = player.color;
			let space: InsertPosition;
			if (player["id"].toString() == this.player_id.toString()) {
				space = "afterbegin";
			} else {
				space = "beforeend";
			}
			$("playerBoards").insertAdjacentHTML(space, /*html*/`
				<div id="playerComponents-${player["id"]}" class="playerComponents">
					<div id="${id}-wrap" class="playerBoard-wrap">
						<div id="${id}" class="playerBoard"></div>
						<div class="mountingSlots" id="mountingSlots-${player["id"]}">
							<div id="mount-1-${player["id"]}"></div>
							<div id="mount-2-${player["id"]}"></div>
							<div id="mount-3-${player["id"]}"></div>
						</div>
						<div class="mountClicks">
							<div id="mount-click-1-${player["id"]}" class="mountClick-${player["id"]}"></div>
							<div id="mount-click-2-${player["id"]}" class="mountClick-${player["id"]}"></div>
							<div id="mount-click-3-${player["id"]}" class="mountClick-${player["id"]}"></div>
						</div>
					</div>
				</div>
				<div id="hand-${player["id"]}" class="handStock"></div>
			`);
			let playerBoard: HTMLElement = $(id);
			playerBoard.style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;
			let position: string;
			player.playerBoard == "monster" ? position = "0" : position = "-100%";
			playerBoard.style.backgroundPositionX = position;
			
			if (player["id"].toString() == this.player_id.toString()) {
				playerBoard.addEventListener("click", e => {
					if (e.target != playerBoard) return;
					this.bgaPerformAction(`actChooseSide`, {curPlayer: player["id"]}, {checkAction: false});
				});
				$("tinyMadness").style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;
			}

			for (let i = 0; i <= 10; i++) {
				playerBoard.insertAdjacentHTML("beforeend", `
					<div id="fishbuck-slot-${player["id"]}-${i}" class="fishbuck-slot"></div>
				`);

				if (i < 10) {
					$(`fishbuck-slot-${player["id"]}-${i}`).style.left = `calc(295px + ${i} * 35.1px)`;
				} else {
					$(`fishbuck-slot-${player["id"]}-${i}`).style.left = `653px`
				}

				$(`fishbuck-slot-${player["id"]}-${i}`).style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;

				if (player.fishbucks != i) {
					$(`fishbuck-slot-${player["id"]}-${i}`).classList.add("hide");
				}
			}

			this.mountingSlots[player["id"]] = []

			for (let i = 1; i <= 3; i++) {
				this.mountingSlots[player["id"]].push(new BgaCards.LineStock(this.seaCardManager, $(`mount-${i}-${player["id"]}`)));
				if (player.mount[i - 1]) {
					let fish = player.mount[i - 1]
					this.mountingSlots[player["id"]][i - 1].addCard(cardTemplate(fish.name, fish.size, fish.depth, fish.coords, fish.name, fish.type, fish.sell, fish.difficulty))
				}
			}

			playerBoard.insertAdjacentHTML("beforeend", `
				<div id="FP-LP-${player["id"]}" class="FP-LP"></div>
				<div id="freshGrid-${player["id"]}" class="freshGrid"></div>
				<div id="spentGrid-${player["id"]}" class="spentGrid"></div>
			`)

			let fpLP = $(`FP-LP-${player["id"]}`);
			if (gamedatas.firstPlayer == player["id"]) {
				fpLP.insertAdjacentHTML("beforeend", `<div id="FP"></div>`);
			}
			
			if (gamedatas.lifePreserver == player["id"]) {
				fpLP.insertAdjacentHTML("beforeend", `<div id="LP"></div>`);
			}

			this.freshStock[player["id"]] = new BgaCards.LineStock(this.diceManager, $(`freshGrid-${player["id"]}`), {sort: BgaCards.sort('type_arg', 'type')});

			this.spentStock[player["id"]] = new BgaCards.ScrollableStock(this.diceManager, $(`spentGrid-${player["id"]}`), {leftButton: {classes: ["hidden"]}, rightButton: {classes: ["hidden"]}, sort: BgaCards.sort('type_arg', 'type')});
			
			
			Object.values(player.dice).forEach(die => {
				switch (die["location"]) {
					case "fresh":
						this.freshStock[player["id"]].addCard(die);
						break;
					case "spent":
						this.spentStock[player["id"]].addCard(die);
						break;
					case "roll":
						if (player["id"] == this.player_id) {
							if (!$('reveal_area')) {
								$('boards').insertAdjacentHTML('beforebegin', /*html*/`<div id="reveal_area" class="reveal_area roll scene whiteblock"></div>`);
							}
							$('reveal_area').insertAdjacentHTML('beforeend', /*html*/`<div class="outlineDice selectable" id="outline-${(die as any).id}"><div id="dice-${(die as any).id}" class="${(die as any).type} dice">
																						<div class="face f1" id="f1-${(die as any).id}"></div>
																						<div class="face f2" id="f2-${(die as any).id}"></div>
																						<div class="face f3" id="f3-${(die as any).id}"></div>
																						<div class="face f4" id="f4-${(die as any).id}"></div>
																						<div class="triangle top t1" id="t1-${(die as any).id}"></div>
																						<div class="triangle top t2" id="t2-${(die as any).id}"></div>
																						<div class="triangle top t3" id="t3-${(die as any).id}"></div>
																						<div class="triangle top t4" id="t4-${(die as any).id}"></div>
																						<div class="triangle bottom t5" id="t5-${(die as any).id}"></div>
																						<div class="triangle bottom t6" id="t6-${(die as any).id}"></div>
																						<div class="triangle bottom t7" id="t7-${(die as any).id}"></div>
																						<div class="triangle bottom t8" id="t8-${(die as any).id}"></div>
																					</div></div>`);
							diceSetup(`${(die as any).id}`);
							diceRotation((die as any).id, parseInt((die as any).type_arg))
							$(`dice-${(die as any).id}`).dataset.type = (die as any).type;
							$(`dice-${(die as any).id}`).dataset.type_arg = (die as any).type_arg;
						} else {
							this.spentStock[player["id"]].addCard(die);
						}
						break;
					default:
						this.showMessage(die["location"] + " has not yet been defined", "error");
						break;
				}
			})

			// Creating all hand stocks
			if (player["id"] == this.player_id) {
				$(`hand-${player["id"]}`).insertAdjacentHTML("beforeend", `<div id="fishHand"></div>`)
				this.fishHandStock = new BgaCards.LineStock(this.seaCardManager, $(`fishHand`), {gap: "5px", wrap: "nowrap", center: false});
				player.hand.fish.forEach(fish => {
					this.fishHandStock.addCard(cardTemplate(fish.name, fish.size, fish.depth, fish.coords, fish.name, fish.type, fish.sell, fish.difficulty));
				});

				$(`hand-${player["id"]}`).insertAdjacentHTML("beforeend", `<div id="reelHand"></div>`)
				this.reelHandStock = new BgaCards.LineStock(this.reelsManager, $(`reelHand`), {gap: "5px", wrap: "nowrap", center: false});
				player.hand.reels.forEach(reel => {
					this.reelHandStock.addCard(reel);
				});

				$(`hand-${player["id"]}`).insertAdjacentHTML("beforeend", `<div id="rodHand"></div>`)
				this.rodHandStock = new BgaCards.LineStock(this.rodsManager, $(`rodHand`), {gap: "5px", wrap: "nowrap", center: false});
				player.hand.rods.forEach(rod => {
					this.rodHandStock.addCard(rod);
				});

				$(`hand-${player["id"]}`).insertAdjacentHTML("beforeend", `<div id="supplyHand"></div>`)
				this.supplyHandStock = new BgaCards.LineStock(this.suppliesManager, $(`supplyHand`), {gap: "5px", wrap: "nowrap", center: false});
				player.hand.supplies.forEach(supply => {
					this.supplyHandStock.addCard(supply);
				});

				// TODO figure out sorting
				$(`hand-${player["id"]}`).insertAdjacentHTML("beforeend", `<div id="regretHand"></div>`)
				this.regretHandStock = new BgaCards.LineStock(this.regretManager, $(`regretHand`), {gap: "5px", wrap: "nowrap", center: false});
				player.hand.regrets.forEach(regret => {
					this.regretHandStock.addCard(regret);
				});

				$(`hand-${player["id"]}`).insertAdjacentHTML("beforeend", `<div id="dinkHand"></div>`)
				this.dinkHandStock = new BgaCards.LineStock(this.dinksManager, $(`dinkHand`), {gap: "5px", wrap: "nowrap", center: false});
				player.hand.dinks.forEach(dink => {
					this.dinkHandStock.addCard(dink);
				});
			}

			this.freshStock[player["id"]].onSelectionChange = () => {
				if ($("confirmButton")) {
					($("confirmButton") as any).disabled = this.freshStock[player["id"]].getSelection().length == 0;
				}
			}

			$(`playerComponents-${player["id"]}`).insertAdjacentHTML("beforeend", `
				<div id="canOfWorms-${player["id"]}" class="canOfWorms provisions">
					<div id="canOfWorms-inner-${player["id"]}" class="canOfWorms-inner">
						<div id="canOfWorms-front-${player["id"]}" class="canOfWorms-front"></div>
						<div id="canOfWorms-back-${player["id"]}" class="canOfWorms-back"></div>
					</div>
				</div>
				<div id="lifeboat-${player["id"]}" class="lifeboat provisions">
					<div id="lifeboat-inner-${player["id"]}" class="lifeboat-inner">
						<div id="lifeboat-front-${player["id"]}" class="lifeboat-front"></div>
						<div id="lifeboat-back-${player["id"]}" class="lifeboat-back"></div>
					</div>
				</div>
			`)

			if (!JSON.parse(player.provisions).lifeboat) {
				$(`lifeboat-${player["id"]}`).classList.add("flipped");
			}
			
			if (!JSON.parse(player.provisions).canOfWorms) {
				$(`canOfWorms-${player["id"]}`).classList.add("flipped");
			}

			this.getPlayerPanelElement(parseInt(player["id"])).innerHTML = tmpl_playerBoard(player["id"], player.color, gamedatas.firstPlayer, gamedatas.lifePreserver);

			let tempDeck: number;
			if (player.location == "sea") {
				tempDeck = player.depth;
			} else {
				tempDeck = 0;
			}
			this.shipDecks[tempDeck].addCard({id: player["id"], colour: this.COLOUR_POSITION[player.color], location: player.location});
			$(`madness_${this.MADNESS_LEVEL[player.regretCount]}_${this.COLOUR_POSITION[colour] / -100}`).style.opacity = "1";
		})
		
		for (let depth = 0; depth < 3; depth++) {
			let curDepth = [];
			for (let num = 0; num < 3; num++) {
				curDepth.push(new BgaCards.Deck(this.seaCardManager, $(`shoal_${depth + 1}_${num + 1}`), {cardNumber: 0, autoRemovePreviousCards: false}));
			}
			this.shoalStocks.push(curDepth);
			this.graveyardStocks.push(new BgaCards.DiscardDeck(this.seaCardManager, $(`shoal_${depth + 1}_graveyard`), {maxHorizontalShift: 0, maxVerticalShift: 0, maxRotation: 0}));
			gamedatas.discard[depth].forEach(fish => {
				this.graveyardStocks[depth].addCard(cardTemplate(fish.name, fish.size, fish.depth, fish.coords, fish.name, fish.type, fish.sell, fish.difficulty));
			});
		}

		// FIXME display none if none there
		let index = 0;
		this.shoalStocks.forEach(depth => {
			depth.forEach(shoal => {
				let curShoal = gamedatas.shoals[index];
				if (curShoal[3]) {
					shoal.addCard(cardTemplate(curShoal[3]["name"], curShoal[1], curShoal[2], curShoal[3]["coords"], curShoal[3]["name"], curShoal[3]["type"], curShoal[3]["sell"], curShoal[3]["difficulty"]));
				} else {
					let size = this.SHOAL_SIZE[curShoal[1]];
					let curDepth = curShoal[2]
					shoal.addCard(cardTemplate(index - 9, size, curDepth), {finalSide: "back"});
				}
				index++;
			})
		})

		this.regretDeck = new BgaCards.Deck(this.regretManager, $(`regretDeck`), {cardNumber: gamedatas.regrets[0]});
		this.regretDiscard = new BgaCards.Deck(this.regretManager, $(`regretDiscard`), {cardNumber: gamedatas.regrets[1]});
		(this.regretDiscard as any).onCardAdded = (card) => {
			this.regretManager.setCardVisible(card, false);
		}

		// FIXME Displays empty when taking cards out on reload
		this.reelsDeck = new BgaCards.Deck(this.reelsManager, $(`reelsDeck`), {cardNumber: parseInt(gamedatas.reels)});
		this.rodsDeck = new BgaCards.Deck(this.rodsManager, $(`rodsDeck`), {cardNumber: parseInt(gamedatas.rods)});
		this.suppliesDeck = new BgaCards.Deck(this.suppliesManager, $(`suppliesDeck`), {cardNumber: parseInt(gamedatas.supplies)});

		for (let i = 1; i <= 6; i++) {
			$("port_board").insertAdjacentHTML("beforeend", `
				<div id="day-${i}" class="dayTracker-slot"></div>
			`)

			if (i != gamedatas.day) {
				$(`day-${i}`).classList.add("hide");
			}
		}

		$("game_play_area").insertAdjacentHTML("afterend", `
			<div id="icon_reference" class="tiny reference"></div>
			<div id="sea_reference" class="tiny reference"></div>
		`)
		$("icon_reference").addEventListener("click", () => {
			if ($("icon_reference").classList.contains("tiny")) {
				$("icon_reference").classList.remove("tiny");
				$("icon_reference").classList.add("large");
				$("sea_reference").style.left = `310px`;
				$("madness_board").style.left = `calc(${$("madness_board").style.left} + 250px)`;
			} else {
				$("icon_reference").classList.remove("large");
				$("icon_reference").classList.add("tiny");
				$("sea_reference").style.left = `60px`;
				$("madness_board").style.left = `calc(${$("madness_board").style.left} - 250px)`;
			}
		});
		$("sea_reference").addEventListener("click", () => {
			if ($("sea_reference").classList.contains("tiny")) {
				$("sea_reference").classList.remove("tiny");
				$("sea_reference").classList.add("large");
				$("madness_board").style.left = `calc(${$("madness_board").style.left} + 250px)`;
			} else {
				$("sea_reference").classList.remove("large");
				$("sea_reference").classList.add("tiny");
				$("madness_board").style.left = `calc(${$("madness_board").style.left} - 250px)`;
			}
		});

		this.dinkDeck = new BgaCards.Deck(this.dinksManager, $("dink_deck"), {cardNumber: gamedatas.dinks, thicknesses: [0, 10, 20], shadowDirection: "top-right"});
	} 
	public async onEnteringState(stateName: string, args: any) {
		switch (stateName) {
			case "LifePreserver":
				if (this.isCurrentPlayerActive()) {
					args.args.possibleChoices.forEach(id => {
						$(`playerBoard-${id}`).classList.add("selectable");
						$(`playerBoard-${id}`).addEventListener("click", e => {
							if (this.gamedatas.gamestate.name == stateName) {
								this.bgaPerformAction("actChooseLPPlayer", {"playerId": id});
							}
						})
					});
				}
				break;
			case "SeaActions":
				if (this.isCurrentPlayerActive()) {
					if (!args.args.casted) {
						let depth = parseInt(args.args.depth);
						for (let i = 1; i <= depth; i++) {
							for (let j = 1; j <= 3; j++) {
								let curShoal = $(`shoal_${i}_${j}`);
								curShoal.classList.add("selectable");
								curShoal.addEventListener("click", e => {
								if (this.gamedatas.gamestate.name == stateName) {
										this.setClientState("client_Confirm", {
											descriptionmyturn: "Choose a shoal to cast in: ",
											args: {name: "actCast", args: {shoal: `${i}|${j}`}, selectedId: `shoal_${i}_${j}`}
										});
									}
								});
							}
						}
					}
				}
				break;
			case "FinishFish":
				if (this.isCurrentPlayerActive()) {
					this.gamedatas.gamestate.args.gameUrl = g_gamethemeurl;
					this.statusBar.setTitle('${you} must pay for the fish (${num}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon"> / ${target}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon">)', args.args);
					let shoalArr = shoalnumToArr(args.args.selected);
					let shoal = $(`shoal_${shoalArr[0]}_${shoalArr[1]}`);
					shoal.classList.add("selected");

					this.freshStock[this.player_id].setSelectionMode("multiple");
					this.freshStock[this.player_id].onSelectionChange = (selection: any, lastChange: any) => {
						if (selection.includes(lastChange)) {
							this.gamedatas.gamestate.args.num += parseInt(this.DICE_VALUE[lastChange.type][lastChange.type_arg]);
						} else {
							this.gamedatas.gamestate.args.num -= parseInt(this.DICE_VALUE[lastChange.type][lastChange.type_arg]);
						}
						args.args.num = this.gamedatas.gamestate.args.num;
						($("finishFishButton") as any).disabled = args.args.num < args.args.target;
						this.statusBar.setTitle('${you} must pay for the fish (${num}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon"> / ${target}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon">)', args.args);
					}

					if (args.args.LP) {
						["LP", "lifePreserverPanel"].forEach(id => {
							$(id).classList.add("selectable");
							$(id).addEventListener("click", () => {
								if ($("LP").classList.contains("selected")) {
									$("LP").classList.remove("selected");
									$("lifePreserverPanel").classList.remove("selected");
									this.gamedatas.gamestate.args.num -= 2;
								} else {
									$("LP").classList.add("selected");
									$("lifePreserverPanel").classList.add("selected");
									this.gamedatas.gamestate.args.num += 2;
								}
								args.args.num = this.gamedatas.gamestate.args.num;
								($("finishFishButton") as any).disabled = args.args.num < args.args.target;
								this.statusBar.setTitle('${you} must pay for the fish (${num}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon"> / ${target}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon">)', args.args);
							})
						})
					}
				}
				break;
			case "client_FreeSeaActions":	
				var lifeboat = $(`lifeboat-${this.player_id}`);
				if (args.args.lifeboat && !args.args.casted) {
					lifeboat.classList.add("selectable");
					lifeboat.addEventListener("click", e => {
						if (this.gamedatas.gamestate.name == stateName) {
							this.bgaPerformAction("actAbandonShip");
						}
					});
				}

				var canOfWorms = $(`canOfWorms-${this.player_id}`)
				if (args.args.canOfWorms && !args.args.casted) {
					canOfWorms.classList.add("selectable");
					canOfWorms.addEventListener("click", e => {
						if (this.gamedatas.gamestate.name == stateName) {
							this.setClientState("client_CanOfWorms", {"descriptionmyturn": "Choose a shoal to peek at"});
						}
					});
				}
				this.freshStock[this.player_id].setSelectionMode("none");
				break;
			case "client_DropSinker":
				this.freshStock[this.player_id].setSelectionMode("single");
				break;
			case "client_CanOfWorms":
				this.shoalStocks.forEach(depth => {
					depth.forEach(shoal => {
						shoal.element.classList.add("selectable");
						shoal.element.addEventListener("click", () => {
							if (this.gamedatas.gamestate.name == stateName) {
								document.querySelectorAll(".selected").forEach(el => {
									el.classList.remove("selected");
								})
								shoal.element.classList.add("selected");

								($("confirmButton") as any).disabled = false;
							}
						})
					})
				})
				break;
			case "CanOfWorms":
				$(`shoal_${args.args.shoal[0]}_${args.args.shoal[1]}`).classList.add("selected");
				if (this.isCurrentPlayerActive()) {
					let fish = args.args["_private"].fish;
					this.shoalStocks[args.args.shoal[0] - 1][args.args.shoal[1] - 1].flipCard(cardTemplate(args.args.shoalNum - 10, this.SHOAL_SIZE[fish.size], fish.depth, fish.coords, fish.name, fish.type, fish.sell, fish.difficulty),
																							{updateData: true});
				}
				break;
			case "client_ShopValue":
				if ($("FP-LP-" + this.player_id).contains($('LP'))) {
					$('LP').classList.add("selectable");
					$('lifePreserverPanel').classList.add("selectable");
					$('LP').addEventListener("click", () => {
						if (!$('LP').classList.contains("selected")) {
							$('LP').classList.add("selected");
							$('lifePreserverPanel').classList.add("selected");
							this.gamedatas.gamestate.args.num -= 2;
							this.gamedatas.gamestate.args.num = Math.max(0, args.args.num)
						} else {
							$('LP').classList.remove("selected");
							$('lifePreserverPanel').classList.remove("selected");
							this.gamedatas.gamestate.args.num += 2;
							this.gamedatas.gamestate.args.num = Math.min(5, args.args.num)
							this.gamedatas.gamestate.args.num = args.args.num % 2 == 0 ? args.args.num - 1 : args.args.num;
						}
						this.statusBar.setTitle('${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args.args);
					})
					$('lifePreserverPanel').addEventListener("click", () => {
						if (!$('LP').classList.contains("selected")) {
							$('LP').classList.add("selected");
							$('lifePreserverPanel').classList.add("selected");
							this.gamedatas.gamestate.args.num -= 2;
							this.gamedatas.gamestate.args.num = Math.max(0, args.args.num)
						} else {
							$('LP').classList.remove("selected");
							$('lifePreserverPanel').classList.remove("selected");
							this.gamedatas.gamestate.args.num += 2;
							this.gamedatas.gamestate.args.num = Math.min(5, args.args.num)
							this.gamedatas.gamestate.args.num = args.args.num % 2 == 0 ? args.args.num - 1 : args.args.num;
						}
						this.statusBar.setTitle('${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args.args);
					})
				}
				break;
			case "client_Sell":
				this.fishHandStock.setSelectionMode("multiple");
				this.fishHandStock.onSelectionChange = (selection, lastChange) => {
					let pm = lastChange.sell + this.REGRET_VALUES[args.madness][lastChange.type]
					pm = Math.max(pm, 0);
					if (selection.includes(lastChange)) {
						this.gamedatas.gamestate.args.newFishbucks += pm;
						this.gamedatas.gamestate.args.num++;
					} else {
						this.gamedatas.gamestate.args.newFishbucks -= pm;
						this.gamedatas.gamestate.args.num--;
					}
					this.gamedatas.gamestate.args.display = args.args.newFishbucks + parseInt(args.args.curFishbucks) > 10 ? 10 : args.args.newFishbucks;
					this.statusBar.setTitle('${you} are selling ${num} fish for ${display} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args.args)
				}
				break;
			case "ShopReveal":
				if (this.isCurrentPlayerActive()) {
					$('game_play_area').insertAdjacentHTML("afterbegin", "<div id=\"reveal_area\" class=\"whiteblock\"></div>");
					if (args.args.shop != "dice") {
						this.revealStock = new BgaCards.LineStock(this[args.args.shop + "Manager"], $("reveal_area"));
						await this.revealStock.addCards(args.args["_private"].reveal, {fromStock: this[args.args.shop + "Deck"], preserveScale: true, autoUpdateCardNumber: false})
					}	
					switch (args.args.shop) {
						case "rods":
						case "reels":
							this.revealStock.setSelectionMode(args.args.num == 5 ? "multiple" : "single");
							this.revealStock.onSelectionChange = () => {
								($('shopConfirm') as any).disabled = ((args.args.num == 5 && this.revealStock.getSelection().length != 2) 
																	|| (args.args.num != 5 && this.revealStock.getSelection().length != 1));
							};
							$(`${args.args.shop}Deck`).dataset.empty = "false";
							break;
						case "supplies":
							this.revealStock.setSelectionMode(args.args.num == 1 ? "single" : "multiple");
							this.revealStock.onSelectionChange = () => {
								($('shopConfirm') as any).disabled = ((args.args.num == 5 && this.revealStock.getSelection().length != 3) 
																	|| (args.args.num == 3 && this.revealStock.getSelection().length != 2)
																	|| (args.args.num == 1 && this.revealStock.getSelection().length != 1));
							};
							$(`${args.args.shop}Deck`).dataset.empty = "false";
							break;
						case "dice":
							$("reveal_area").classList.add("roll", "scene");
							args.args["_private"].reveal.forEach(dice => {
								$("reveal_area").insertAdjacentHTML("beforeend", `
									<div class="outlineDice" id="outline-${dice.id}">
										<div class="${dice.type} dice" id="dice-${dice.id}">
											<div class="face f1" id="f1-${dice.id}"></div>
											<div class="face f2" id="f2-${dice.id}"></div>
											<div class="face f3" id="f3-${dice.id}"></div>
											<div class="face f4" id="f4-${dice.id}"></div>
											<div class="triangle top 1" id="t1-${dice.id}"></div>
											<div class="triangle top t2" id="t2-${dice.id}"></div>
											<div class="triangle top t3" id="t3-${dice.id}"></div>
											<div class="triangle top t4" id="t4-${dice.id}"></div>
											<div class="triangle bottom t5" id="t5-${dice.id}"></div>
											<div class="triangle bottom t6" id="t6-${dice.id}"></div>
											<div class="triangle bottom t7" id="t7-${dice.id}"></div>
											<div class="triangle bottom t8" id="t8-${dice.id}"></div>
										</div>
									</div>
								`)
								this.animationManager.slideIn($(`dice-${dice.id}`), $('port_board'))
								$(`dice-${dice.id}`).dataset.dieId = dice.id;
								$(`outline-${dice.id}`).dataset.dieId = dice.id;
								diceSetup(dice.id);
							});
							break;
					}
				}
				break;
			case "client_Mount":
				this.fishHandStock.setSelectionMode("single");
				this.fishHandStock.onCardClick = (card) => {
					let el = document.querySelector(".selected")
					this.fishHandStock.setSelectionMode("none");
					el.classList.add("selected")
					document.querySelectorAll(".mountClicks").forEach(el => (el as HTMLElement).style.pointerEvents = "auto");
					document.querySelectorAll(".mountClick-" + this.player_id).forEach(el => {
						if (!$(el.id.replace("click-", "")).dataset.empty || $(el.id.replace("click-", "")).dataset.empty == 'true') {
							el.classList.add("selectable")
							el.addEventListener("click", e => {
								this.newMounted.push(card);
								this.clearedSpots.push(parseInt((e.target as HTMLElement).id.substring(12, 13)))
								this.mountingSlots[this.player_id][parseInt((e.target as HTMLElement).id.substring(12, 13)) - 1].addCard(card)
								document.querySelectorAll(".selectable").forEach(el => {
									el.classList.remove("selectable");
									el.replaceWith(el.cloneNode(true))
								})
								this.fishHandStock.setSelectionMode("none");
								this.fishHandStock.setSelectionMode("single");
								document.querySelectorAll(".mountClicks").forEach(el => (el as HTMLElement).style.pointerEvents = "none");
							})
						}
					})
				}
				break;
			case "client_Confirm":
				if (args.args.selectedId) {
					$(args.args.selectedId).classList.add("selected");
				}
				break;
			case "PassAction":
				this.regretHandStock.setSelectionMode("single");
				break;
			case "SelectFreshPRIV":
				if (!$('reveal_area')) {
					$('boards').insertAdjacentHTML('beforebegin', /*html*/`<div id="reveal_area" class="reveal_area roll scene whiteblock"></div>`);
					args.args[0].forEach(die => {
						this.diceManager.getCardStock(die).removeCard(die, {slideTo: $("reveal_area")});
					});
					await new Promise(r => setTimeout(r, 500));
					args.args[0].forEach(die => {
						$('reveal_area').insertAdjacentHTML('beforeend', /*html*/`<div class="outlineDice selectable" id="outline-${(die as any).id}"><div id="dice-${(die as any).id}" class="${(die as any).type} dice">
																					<div class="face f1" id="f1-${(die as any).id}"></div>
																					<div class="face f2" id="f2-${(die as any).id}"></div>
																					<div class="face f3" id="f3-${(die as any).id}"></div>
																					<div class="face f4" id="f4-${(die as any).id}"></div>
																					<div class="triangle top t1" id="t1-${(die as any).id}"></div>
																					<div class="triangle top t2" id="t2-${(die as any).id}"></div>
																					<div class="triangle top t3" id="t3-${(die as any).id}"></div>
																					<div class="triangle top t4" id="t4-${(die as any).id}"></div>
																					<div class="triangle bottom t5" id="t5-${(die as any).id}"></div>
																					<div class="triangle bottom t6" id="t6-${(die as any).id}"></div>
																					<div class="triangle bottom t7" id="t7-${(die as any).id}"></div>
																					<div class="triangle bottom t8" id="t8-${(die as any).id}"></div>
																				</div></div>`);
						diceSetup(`${(die as any).id}`);
						diceRotation((die as any).id, parseInt((die as any).type_arg))
						$(`dice-${(die as any).id}`).dataset.type = (die as any).type;
						$(`dice-${(die as any).id}`).dataset.type_arg = (die as any).type_arg;
					});
				}
				document.querySelectorAll(".outlineDice").forEach(dice => {
					dice.addEventListener("click", () => {
						if (dice.classList.contains("selected")) {
							dice.classList.remove("selected");
						} else {
							dice.classList.add("selected");
						}
					})
				})
				break;
			case "SelectRollPRIV":
				this.freshStock[this.player_id].setSelectionMode("multiple");
				break;
		}		
	}
	public onLeavingState(stateName: string) {
		document.querySelectorAll(".selectable").forEach(el => {
			el.classList.remove("selectable");
		})
		document.querySelectorAll(".selected").forEach(el => {
			el.classList.remove("selected");
		})
		this.freshStock[this.player_id].setSelectionMode("none");
		this.fishHandStock.setSelectionMode("none");
		if ($('reveal_area')) {
			$('reveal_area').remove();
		}
	}
	public onUpdateActionButtons(stateName: string, args: any) {
		if (this.isCurrentPlayerActive()) {
			switch (stateName) {
				case "LifePreserver":
					args.possibleChoices.forEach(id => {
						this.statusBar.addActionButton(this.getFormattedPlayerName(id), () => this.bgaPerformAction("actChooseLPPlayer", {"playerId": id}), {"color": "secondary"});
					});
					break;
				case "SeaActions":
					this.statusBar.addActionButton(_("Free Actions"), () => this.setClientState("client_FreeSeaActions", {"descriptionmyturn": "Perform free actions:", args: {"lifeboat": args.lifeboat, "dice": args.dice, "canOfWorms": args.canOfWorms, "casted": args.casted}}), {color: "secondary"})
					if (args.casted) {
						this.statusBar.addActionButton(_("End Turn"), () => this.bgaPerformAction("actEndTurn"), {color: "alert"});
					} else {
						this.statusBar.addActionButton(_("Pass"), () => this.bgaPerformAction("actPass"), {color: "alert"});
					}
					break;
				case "FinishFish":
					this.statusBar.addActionButton(_("Confirm"), () => this.bgaPerformAction("actFinishFish", 
																							{dice: JSON.stringify(this.freshStock[this.player_id].getSelection()), LP: $('LP').classList.contains("selected")}), 
																							{disabled: args.target > 0, id: "finishFishButton"});
					this.statusBar.addActionButton(_("Reset"), () => {
						this.freshStock[this.player_id].unselectAll(true);
						if ($("LP").classList.contains("selected")) {
							$("LP").classList.remove("selected");
							$("lifePreserverPanel").classList.remove("selected");
						}
						this.gamedatas.gamestate.args.num = 0;
						($("finishFishButton") as any).disabled = true;
						this.statusBar.setTitle('${you} must pay for the fish (${num}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon"> / ${target}<img src="' + g_gamethemeurl + 'img/icons/Catch.png" alt="fishbucks" class="icon">)', args);
					}, {color: "secondary"})
					break;
				case "client_FreeSeaActions":
					if (args.lifeboat && !args.casted) {
						this.statusBar.addActionButton(_("Abandon Ship"), () => this.bgaPerformAction("actAbandonShip"), {"color": "secondary"});
					}
					if (!args.casted) {
						this.statusBar.addActionButton(_("Drop Sinker"), () => this.setClientState("client_DropSinker", {"descriptionmyturn": "Choose a die to use"}), {"color": "secondary"});
					}
					if (args.canOfWorms && !args.casted) {
						this.statusBar.addActionButton(_("Use Can of Worms"), () => this.setClientState("client_CanOfWorms", {"descriptionmyturn": "Choose a shoal to peek at"}), {"color": "secondary"});
					}
					this.statusBar.addActionButton(_("Exit"), () => this.restoreServerGameState(), {color: "alert"});
					break;
				case "client_DropSinker":
					this.statusBar.addActionButton(_("Confirm"), () => {
						this.bgaPerformAction("actDropSinker", {dice: this.freshStock[this.player_id].getSelection()[0].id})
					}, {color: "primary", disabled: true, id: "confirmButton"});
					this.statusBar.addActionButton(_("Cancel"), () => this.setClientState("client_FreeSeaActions", {"descriptionmyturn": "Perform free actions"}), {color: "alert"});
					break;
				case "client_CanOfWorms":
					this.statusBar.addActionButton(_("Confirm"), () => {
						let id = document.querySelector(".selected").id;
						let split = id.split("_").slice(1);

						let shoalNum = (parseInt(split[0]) - 1) * 3 + parseInt(split[1]);

						this.bgaPerformAction("actCanOfWorms", {shoalNum: shoalNum})
					}, {color: "primary", disabled: true, id: "confirmButton"});
					this.statusBar.addActionButton(_("Cancel"), () => this.setClientState("client_FreeSeaActions", {"descriptionmyturn": "Perform free actions"}), {color: "alert"});
					break;
				case "CanOfWorms":
					this.statusBar.addActionButton(_("Top"), () => this.bgaPerformAction("actSetPlace", {"place": "top"}));
					this.statusBar.addActionButton(_("Bottom"), () => this.bgaPerformAction("actSetPlace", {"place": "bottom"}));
					break;
				case "PortActions":
					if (!(this.gamedatas.gamestate.args.actionComplete || this.actionComplete)) {
						this.statusBar.addActionButton("Visit a Shop", () => this.setClientState("client_Shop", Object.assign(args, {"descriptionmyturn": "${you} are visiting shops"})));
						this.statusBar.addActionButton("Sell Fish", () => this.setClientState("client_Sell", Object.assign(args, {"descriptionmyturn": '${you} are selling ${num} fish for ${newFishbucks} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">'})));
						this.statusBar.addActionButton("Mount Fish", () => this.setClientState("client_Mount", Object.assign(args, {"descriptionmyturn": "${you} are mounting fish"})));
						this.statusBar.addActionButton("Free Actions", () => console.log("fA"), {color: "secondary"});
						this.statusBar.addActionButton("Pass", () => this.bgaPerformAction("actPass"), {color: "alert"});
						this.actionComplete = false;
					} else {
						// TODO add free actions port
						this.statusBar.addActionButton("Free Actions", () => console.log("fA"), {color: "secondary"});
						this.statusBar.addActionButton("End Turn", () => this.bgaPerformAction("actEndTurn"), {color: "alert"});
						this.actionComplete = false;
					}
					break;
				case "client_Shop":
					if (!args.dice) {
						this.statusBar.addActionButton("Dice Shop", () => this.setClientState("client_ShopValue", {descriptionmyturn: '${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args: {shop: "dice", num: 1}}));
					}
					if (!args.rods) {
						this.statusBar.addActionButton("Rod Shop", () => this.setClientState("client_ShopValue", {descriptionmyturn: '${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args: {shop: "rod", num: 1}}));
					}
					if (!args.reels) {
						this.statusBar.addActionButton("Reel Shop", () => this.setClientState("client_ShopValue", {descriptionmyturn: '${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args: {shop: "reel", num: 1}}));
					}
					if (!args.supplies) {
						this.statusBar.addActionButton("Supply Shop", () => this.setClientState("client_ShopValue", {descriptionmyturn: '${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args: {shop: "supply", num: 1}}));
					}
					this.statusBar.addActionButton("Back", () => this.restoreServerGameState(), {color: "alert"});
					break;
				case "client_ShopValue":
					this.statusBar.addActionButton("+", () => {
						if (args.num < ($('LP').classList.contains("selected") ? 3 : 5)) {
							this.gamedatas.gamestate.args.num += 2;
							this.gamedatas.gamestate.args.num = args.num % 2 == 0 ? args.num - 1 : args.num;
							this.statusBar.setTitle('${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args);
						}
					}, {color: "secondary"});
					this.statusBar.addActionButton("-", () => {
						if (args.num > ($('LP').classList.contains("selected") ? 0 : 1)) {
							this.gamedatas.gamestate.args.num -= 2;
							this.gamedatas.gamestate.args.num = Math.max(args.num, 0);
							this.statusBar.setTitle('${you} are visiting the ${shop} shop and spending ${num} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args);
						}
					}, {color: "secondary"});
					this.statusBar.addActionButton("Confirm", () => {
						let reduction = 0;
						reduction += $('LP').classList.contains("selected") ? 2 : 0;
						this.bgaPerformAction("actShop", {shop: args.shop, cost: args.num, reduction: reduction})
					});
					this.statusBar.addActionButton("Back", () => this.setClientState("client_Shop", Object.assign(args, {"descriptionmyturn": "${you} are visiting shops"})), {color: "alert"})
					break;
				case "client_Sell":
					this.statusBar.addActionButton("Confirm", () => this.bgaPerformAction("actSell", {fish: JSON.stringify(this.fishHandStock.getSelection())}));
					this.statusBar.addActionButton("Select All", () => {
						this.fishHandStock.selectAll(true);
						let totalSelection = this.fishHandStock.getSelection()
							.filter((curVal) => curVal.sell + this.REGRET_VALUES[args.madness][curVal.type] > 0)
							.reduce((total, curVal) => total + curVal.sell + this.REGRET_VALUES[args.madness][curVal.type], 0)
						this.gamedatas.gamestate.args.newFishbucks = totalSelection;
						this.gamedatas.gamestate.args.display = args.newFishbucks + parseInt(args.curFishbucks) > 10 ? 10 : args.newFishbucks;
						this.gamedatas.gamestate.args.num = this.fishHandStock.getSelection().length;
						this.statusBar.setTitle('${you} are selling ${num} fish for ${display} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args);
					}, {color: "secondary"});
					this.statusBar.addActionButton("Reset", () => {
						this.fishHandStock.unselectAll(true);
						this.gamedatas.gamestate.args.newFishbucks = 0;
						this.gamedatas.gamestate.args.display = 0;
						this.gamedatas.gamestate.args.num = 0;
						this.statusBar.setTitle('${you} are selling ${num} fish for ${display} <img src="' + g_gamethemeurl + 'img/icons/Fishbucks.png" alt="fishbucks" class="icon">', args);
					}, {color: "secondary"});
					this.statusBar.addActionButton("Back", () => this.restoreServerGameState(), {color: "alert"});
					break;
				case "ShopReveal":
					if (args.shop != "dice") {
						this.statusBar.addActionButton("Confirm", () => this.bgaPerformAction("actBuyCards", {cards: JSON.stringify(this.revealStock.getSelection())}), {id: "shopConfirm", disabled: true});
						this.statusBar.addActionButton("Reset", () => {
							this.revealStock.unselectAll();
							($('shopConfirm') as any).disabled = true;
						}, {color: "secondary"});
					} else {
						this.statusBar.addActionButton("Roll", () => {
							let children = $('reveal_area').children;
							for (let i = 0; i < children.length; i++) {
								let child: any = children[i];
								diceRotation(child.dataset.dieId, parseInt(args["_private"].reveal[i].type_arg));
							}
							this.statusBar.removeActionButtons();
							this.statusBar.setTitle("${you} must choose which dice to place in your fresh pool");
							this.statusBar.addActionButton("Confirm", () => {
								let send = [];
								document.querySelectorAll(".selected").forEach((el: any) => {
									send.push(el.dataset.dieId);
								})
								this.bgaPerformAction("actChooseDice", {diceJSON: JSON.stringify(send)});
							}, {disabled: true, id: "rollButton"});
							this.statusBar.addActionButton("Reset", () => {
								document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
								($('rollButton') as any).disabled = true;
							}, {color: "secondary"});
							document.querySelectorAll(".outlineDice").forEach(dice => {
								dice.classList.add("selectable");
								dice.addEventListener("click", () => {
									if (dice.classList.contains("selected")) {
										dice.classList.remove("selected");
									} else {
										dice.classList.add("selected");
									}
									if (document.querySelectorAll(".selected").length == args.maxFresh - args.freshSize) {
										($('rollButton') as any).disabled = false;
									} else {
										($('rollButton') as any).disabled = true;
									}
								})
							})
						});
					}
					break;
				case "client_Mount":
					let ms = this.mountingSlots[this.player_id];
					this.statusBar.addActionButton("Confirm", () => this.bgaPerformAction("actMount", {"mounted": JSON.stringify([ms[0].getCards()[0], ms[1].getCards()[0], ms[2].getCards()[0]])}));
					this.statusBar.addActionButton("Reset", () => {
						this.fishHandStock.addCards(this.newMounted); 
						this.newMounted = []
						document.querySelectorAll(`.mountClick-${this.player_id}`).forEach(el => {
							if (this.clearedSpots.includes(parseInt(el.id.substring(12, 13)))) {
								(el as HTMLElement).dataset.empty = 'true'
							}
						})
						this.clearedSpots = []
						document.querySelectorAll(".selectable").forEach(el => {
							el.classList.remove("selectable");
							el.replaceWith(el.cloneNode(true))
						})
						this.fishHandStock.setSelectionMode("none");
						document.querySelectorAll(".mountClicks").forEach(el => (el as HTMLElement).style.pointerEvents = "none");
						this.fishHandStock.setSelectionMode("single");
					}, {color: "secondary"})
					this.statusBar.addActionButton("Back", () => {
						this.fishHandStock.addCards(this.newMounted); 
						this.newMounted = []
						document.querySelectorAll(`.mountClick-${this.player_id}`).forEach(el => {
							if (this.clearedSpots.includes(parseInt(el.id.substring(12, 13)))) {
								(el as HTMLElement).dataset.empty = 'true'
							}
						})
						document.querySelectorAll(".mountClicks").forEach(el => (el as HTMLElement).style.pointerEvents = "none");
						this.clearedSpots = []
						this.restoreServerGameState()
					}, {color: "alert"});
					break;
				case "PassAction":
					this.statusBar.addActionButton("Discard Regret", () => this.bgaPerformAction("actDiscard", {id: this.regretHandStock.getSelection()[0]["id"] || -1}));
					this.statusBar.addActionButton("Draw Dink", () => this.bgaPerformAction("actDraw"));
					break;
				case "client_Confirm":
					this.statusBar.addActionButton(_("Confirm"), () => {this.bgaPerformAction(args.name, args.args); this.restoreServerGameState()});
					this.statusBar.addActionButton(_("Cancel"), () => this.restoreServerGameState(), {color: "alert"});
					break;
				case "SelectFreshPRIV":
					this.statusBar.addActionButton("Confirm", () => {
						let ids = [];
						document.querySelectorAll('.selected').forEach(el => {
							ids.push(parseInt(el.id.replace('outline-', '')));
						})
						this.bgaPerformAction('actChooseDice', {diceArray: JSON.stringify(ids)});
					});
					break;
				case "SelectRollPRIV":
					this.statusBar.addActionButton("Confirm", () => {
						let ids = [];
						document.querySelectorAll('.selected').forEach(el => {
							ids.push(parseInt(el.id.replace('dice-', '')));
						})
						this.bgaPerformAction('actChooseDice', {diceArray: JSON.stringify(ids)});
					});
					break;
			}
		}
	}
	public setupNotifications() {
		this.bgaSetupPromiseNotifications();
	}

	public notif_playerBoardSide(args) {
		let position: string;
		args.newSide == "monster" ? position = "-100%" : position = "0";
		$(`playerBoard-${args.player_id}`).style.backgroundPositionX = position;
	}

	public async notif_lifePreserver(args) {
		let lPPlayer = args.player_id2;
		this.getPlayerPanelElement(lPPlayer).insertAdjacentHTML("beforeend", `<div id="lifePreserverPanel"></div>`);
		await this.animationManager.fadeIn($("lifePreserverPanel"), $(`playerBoard-${args.player_id1}`), {duration: 1000});
		$(`FP-LP-${args.player_id2}`).insertAdjacentHTML("beforeend", `<div id="LP"></div>`);
		await this.animationManager.fadeIn($("LP"), $(`playerBoard-${args.player_id1}`), {duration: 1000});
	}

	public notif_selectedShoal(args) {
		document.querySelectorAll(".shoal.selectable").forEach(shoal => {
			shoal.classList.remove("selectable");
		})
		$(`shoal_${args.shoal[0]}_${args.shoal[1]}`).classList.add("selected");
	}

	public notif_revealCard(args: any) {
		let fish = args.fish;
		this.shoalStocks[args.shoal[0] - 1][args.shoal[1] - 1].flipCard(cardTemplate(args.shoalNum - 10, this.SHOAL_SIZE[fish.size], args.depth, fish.coords, fish.name, fish.type, fish.sell, fish.difficulty),
																		{updateData: true}
		)
	}

	public notif_abandonedShip(args: any) {
		$(`lifeboat-${args.player_id}`).classList.add("flipped");
		$(`lifeboat-${args.player_id}`).classList.remove("selectable");

		this.shipDecks[0].addCard({id: args.player_id, location: "port"})
	}

	public notif_dropSinker(args: any) {
		this.shipDecks[args.depth2].addCard({id: args.player_id});
		this.spentStock[args.player_id].addCard({id: args.dice});

		this.setClientState("client_FreeSeaActions", {"descriptionmyturn": "Perform free actions"});
	}

	public async notif_canOfWormsMove(args: any) {
		this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].flipCard({id: args.shoalNum - 10, coords: [-1, -1]});
		$('canOfWorms-' + this.getActivePlayerId()).classList.add("flipped");

		if (args.place == "bottom") {
			await new Promise(r => setTimeout(r, 500));
		
			await this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].addCard(cardTemplate("temp", this.SHOAL_SIZE[args.newTop[0]], args.depth), {fadeIn: false, duration: 0, index: 0});

			$('card-' + (args.shoalNum - 10)).style.zIndex = "3";
			$('card-temp').style.zIndex = "2";
			$('card-' + (args.shoalNum - 10)).style.transform = 'translateX(30%)';

			await new Promise(r => setTimeout(r, 500));

			$('card-' + (args.shoalNum - 10)).style.zIndex = "1";
			$('card-' + (args.shoalNum - 10)).style.transform = '';

			await new Promise(r => setTimeout(r, 500));

			await this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].removeCard({id: args.shoalNum - 10, coords: [-1, -1]}, {autoUpdateCardNumber: false});
			
			await this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].addCard(cardTemplate(args.shoalNum - 10, this.SHOAL_SIZE[args.newTop[0]], args.depth), {fadeIn: false, duration: 0, index: 0});
			await this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].removeCard({id: "temp", coords: [-1, -1]}, {autoUpdateCardNumber: false});
		}
	}

	public async notif_finishFish(args: any) {
		this.freshStock[args.player_id].onSelectionChange = null;
		let shoal = shoalnumToArr(args.shoal)
		if (args.LP) {
			this.animationManager.fadeOutAndDestroy($("LP"));
			this.animationManager.fadeOutAndDestroy($("lifePreserverPanel"));
		}
		args.moved.forEach(die => {
			this.spentStock[args.player_id].addCard({id: die["id"], coords: [-1, -1]});
		});


		let curTop = this.shoalStocks[shoal[0] - 1][shoal[1] - 1].getCards()[0];
		let newTop = args.newTop;
		await this.shoalStocks[shoal[0] - 1][shoal[1] - 1].addCard(cardTemplate(curTop.name, curTop.size, curTop.depth, curTop.coords, curTop.name, curTop.type, curTop.sell, curTop.difficulty), {index: 0, duration: 0, fadeIn: false});
		await this.shoalStocks[shoal[0] - 1][shoal[1] - 1].removeCard({id: args.shoal - 10}, {autoUpdateCardNumber: false});
		curTop = this.shoalStocks[shoal[0] - 1][shoal[1] - 1].getCards()[0];
		await this.shoalStocks[shoal[0] - 1][shoal[1] - 1].addCard(cardTemplate(args.shoal - 10, newTop.size, newTop.depth), {index: 0, duration: 0, fadeIn: false});

		await this.fishHandStock.addCard(curTop, {autoUpdateCardNumber: false});
	}

	public async notif_sellFish(args: any) {
		this.gamedatas.gamestate.args.actionComplete = true;
		if (args.curFishbucks != args.total) {
			let curFishbucks = $(`fishbuck-slot-${args.player_id}-${args.curFishbucks}`);
			let curLeft = (curFishbucks as HTMLElement).style.left;
			(curFishbucks as HTMLElement).style.left = `calc(295px + ${args.total} * 35.1px)`;

			await new Promise(r => setTimeout(r, 800));
			$(`fishbuck-slot-${args.player_id}-${args.total}`).classList.remove("hide");		
			(curFishbucks as HTMLElement).classList.add("hide");
			(curFishbucks as HTMLElement).style.left = curLeft;
		}

		args.ids.forEach(async id => {
			let fish = this.fishHandStock.getCards().filter(card => card.id == id)[0];
			await this.graveyardStocks[fish.depth - 1].addCard(fish);
		});

		this.restoreServerGameState();
	}

	public async notif_buyCards(args: any) {
		let toHandStock = {
			reels: "reelHandStock",
			rods: "rodHandStock",
			supplies: "supplyHandStock"
		}
		
		await this[toHandStock[args.shop]].addCards(args.cards, 800);
		await this.revealStock.removeAll({slideTo: $(`${args.shop}Deck`)});
		$('reveal_area').remove();
		await this[args.shop + "Deck"].shuffle();
	}

	public async notif_chooseFresh(args: any) {
		document.querySelectorAll(".outlineDice.selected").forEach(dice => {
			dice.remove();
		})
		await this.freshStock[args.player_id].addCards(args.fresh, {fromElement: $('reveal_area')})
		document.querySelectorAll(".outlineDice").forEach(dice => {
			dice.remove();
		})
		this.spentStock[args.player_id].addCards(args.spent, {fromElement: $('reveal_area')})
		$('reveal_area').remove();
	}

	public async notif_spendFishbucks(args: any) {
		if (args.curFishbucks != args.newFishbucks) {
			let curFishbucks = $(`fishbuck-slot-${args.player_id}-${args.curFishbucks}`);
			let curLeft = (curFishbucks as HTMLElement).style.left;
			(curFishbucks as HTMLElement).style.left = `calc(295px + ${args.newFishbucks} * 35.1px)`;

			await new Promise(r => setTimeout(r, 800));
			$(`fishbuck-slot-${args.player_id}-${args.newFishbucks}`).classList.remove("hide");		
			(curFishbucks as HTMLElement).classList.add("hide");
			(curFishbucks as HTMLElement).style.left = curLeft;
		}
	}

	public async notif_mountFish(args: any) {
		let fish = args.fish
		if (!this.isCurrentPlayerActive()) {
			await this.mountingSlots[args.player_id][args.slot - 1].addCard(cardTemplate(fish.name, fish.size, fish.depth, fish.coords, fish.name, fish.type, fish.sell, fish.difficulty), {fromElement: "player_board_" + this.player_id})
		}
		this.actionComplete = true;
		this.restoreServerGameState();
	}

	public async notif_drawDink(args: any) {
		if (this.isCurrentPlayerActive()) {
			await this.dinkHandStock.addCard(args["_private"][0], {fromElement: $('dink_deck'), fadeIn: false})
		}
	}

	public async notif_discardRegret(args: any) {
		let regret = this.regretHandStock.getCards().filter(card => parseInt(card.id) == args.regret)[0];
		if (this.isCurrentPlayerActive()) {
			await (this.regretDiscard as any).addCard(regret)
		} else {
			await (this.regretDiscard as any).addCard(regret, {fromElement: `player_board_${args.player_id}`});
		}
	}

	public notif_selectFresh(args: any) {
		args.ids.forEach(dice => {
			$('outline-' + dice.id).remove();
			this.freshStock[args.player_id].addCard(dice, {fromElement: $('reveal_area')})
		});
		args.other.forEach(dice => {
			$('outline-' + dice.id).remove();
			this.spentStock[args.player_id].addCard(dice, {fromElement: $('reveal_area')})
		});
		$('reveal_area').remove();
	}

	public notif_test(args: any) {
		console.log(args);
	}
}