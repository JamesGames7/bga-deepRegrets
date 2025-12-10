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
	public spentStock = {};
	public shoalStocks: any[][] = [];
	public graveyardStocks: any[] = [];
	public reelsDeck = {};
	public rodsDeck = {};
	public suppliesDeck = {};
	public shipDecks: any[] = [];
	public dinkDeck = {};
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

	constructor() {
		// @ts-ignore
		super();
	}
	
	public setup(gamedatas: any) {
		this.setupNotifications();

		document.getElementById("game_play_area").insertAdjacentHTML("beforeend", `
			<div id="boards">
				<div id="sea_board" style="zoom: ${localStorage.getItem("sea_board") || ((document.getElementById("board").clientWidth / 726) > 1 ? document.getElementById("board").clientWidth / 726 : 1)}">
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
				<div id="port_board" style="zoom: ${localStorage.getItem("port_board") || ((document.getElementById("board").clientWidth / 1500) > 1 ? document.getElementById("board").clientWidth / 1500 : 1)}">
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
			</div>
			<div id="playerBoards"></div>
			<div id="lineGrid"></div>
		`)

		document.querySelectorAll(".utility_button").forEach(button => {
			let boards = document.getElementById("boards");
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
				let board: HTMLElement = document.getElementById(id.substring(0, id.indexOf("_")) + "_board");
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
			let port = document.getElementById("port_board");
			let boards = document.getElementById("boards");

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
            type: 'card',
            getId: (card) => (card as any).id,
			cardWidth: 156,
			cardHeight: 215,
			isCardVisible(card: {coords}) {
				return card.coords[0] != -1;
			},
			setupDiv: (card, div) => {
				div.dataset.type = (card as any).type;
				div.dataset.typeArg = (card as any).type_arg;
			},
			setupBackDiv: (card: {size, depth}, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/seaBacks.png)`
				div.style.backgroundSize = "300% 300%";
				div.style.borderRadius = `6px`;
				div.style.backgroundPositionX = `-${card.size}00%`;
				div.style.backgroundPositionY = `-${card.depth - 1}00%`;
                this.addTooltipHtml(div.id, `Fish in a shoal<br><strong>Depth:</strong> ${card.depth}<br><strong>Size:</strong> ${toTitleCase(Object.keys(this.SHOAL_SIZE).find(key => this.SHOAL_SIZE[key] === card.size))}`);
			},
            setupFrontDiv: (card: {coords: [number, number], name, size, depth, type, sell, difficulty}, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/seaCards.png)`
				div.style.backgroundSize = "1300% 900%";
				div.style.borderRadius = `6px`;
				div.style.backgroundPositionX = `-${card.coords[0]}00%`;
				div.style.backgroundPositionY = `-${card.coords[1]}00%`;
                this.addTooltipHtml(div.id, frontTooltipFish(card.coords, card.name, card.size, card.depth, card.type, card.sell, card.difficulty));
            },
        });

        // create the dice manager
        this.diceManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'dice',
            getId: (dice) => (dice as any).id,
			cardWidth: 95 / 2,
			cardHeight: 132 / 2,
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
				div.style.backgroundPositionX = `-${card.type % 10}%`; 
				div.style.backgroundPositionY = `-${Math.floor(card.type / 10)}`;
				div.style.backgroundSize = "1000% 700%";
				div.style.borderRadius = `12px`;
                this.addTooltipHtml(div.id, `Regret of magnitude ${card.type_arg}`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/regrets.png)`;
            },
        });		

		// create the rods / reels / supplies managers
        this.reelsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'reels',
            getId: (card: any) => card.id,
			cardWidth: 350,
			cardHeight: 490,
			setupDiv: (card: any, div) => {
				div.dataset.type = card.type;
				div.dataset.typeArg = card.type_arg;
			},
			setupBackDiv: (card: any, div) => {
				div.style.backgroundImage = `url(${g_gamethemeurl}img/reels.png)`;
				div.style.backgroundPosition = `0 0`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
			},
            setupFrontDiv: (card: any, div) => {
				div.style.backgroundPositionX = `-${card.type % 10}%`; 
				div.style.backgroundPositionY = `-${Math.floor(card.type / 10)}`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
                this.addTooltipHtml(div.id, `Reel`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/reels.png)`;
            },
        });		

        this.rodsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'rods',
            getId: (card: any) => card.id,
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
				div.style.backgroundPositionX = `-${card.type % 10}%`; 
				div.style.backgroundPositionY = `-${Math.floor(card.type / 10)}`;
				div.style.backgroundSize = "500% 300%";
				div.style.borderRadius = `12px`;
                this.addTooltipHtml(div.id, `Rod`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/rods.png)`;
            },
        });	
		
        this.suppliesManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'rods',
            getId: (card: any) => card.id,
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
				div.style.backgroundPositionX = `-${card.type % 10}%`; 
				div.style.backgroundPositionY = `-${Math.floor(card.type / 10)}`;
				div.style.backgroundSize = "600% 400%";
				div.style.borderRadius = `12px`;
                this.addTooltipHtml(div.id, `Rod`);
				div.style.backgroundImage = `url(${g_gamethemeurl}img/supplies.png)`;
            },
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
            getId: (dink: any) => -1,
			cardWidth: 103,
			cardHeight: 147,
			isCardVisible: (card) => false,
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
				el = document.getElementById("ship_port");
			} else {
				el = document.getElementById(`ship_grid_${i}`);
			}
			this.shipDecks.push(new BgaCards.LineStock(this.shipsManager, el, {direction: "column", wrap: "nowrap"}));
			this.shipDecks[0].onCardAdded = (card: any) => console.log(card);
		}
		// Madness board setup
		document.getElementById("game_play_area").insertAdjacentHTML("afterend", `
			<div id="madness_board">
				<div id="tinyMadness" class="tiny"></div>
				<div id="largeMadness" class="tiny">
					<div id="madnessGrid"></div>
				</div>
			</div>
		`);
		let mGrid = document.getElementById("madnessGrid");
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 5; j++) {
				mGrid.insertAdjacentHTML("beforeend", `<div id="madness_${i}_${j}" class="madnessSlot madness_${j}"></div>`)
			}
		}
		let el = document.getElementById("madness_board");
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
			document.getElementById("playerBoards").insertAdjacentHTML(space, `
				<div id="playerComponents-${player["id"]}" class="playerComponents"><div id="${id}" class="playerBoard"></div></div>
			`);
			let playerBoard: HTMLElement = document.getElementById(id);
			playerBoard.style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;
			let position: string;
			player.playerBoard == "monster" ? position = "0" : position = "-100%";
			playerBoard.style.backgroundPositionX = position;
			
			if (player["id"].toString() == this.player_id.toString()) {
				playerBoard.addEventListener("click", e => {
					if (e.target != playerBoard) return;
					this.bgaPerformAction(`actChooseSide`, {curPlayer: player["id"]}, {checkAction: false});
				});
				document.getElementById("tinyMadness").style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;
			}

			for (let i = 0; i <= 10; i++) {
				playerBoard.insertAdjacentHTML("beforeend", `
					<div id="fishbuck-slot-${player["id"]}-${i}" class="fishbuck-slot"></div>
				`);

				if (i < 10) {
					document.getElementById(`fishbuck-slot-${player["id"]}-${i}`).style.left = `calc(295px + ${i} * 35.1px)`;
				} else {
					document.getElementById(`fishbuck-slot-${player["id"]}-${i}`).style.left = `653px`
				}

				document.getElementById(`fishbuck-slot-${player["id"]}-${i}`).style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;

				if (player.fishbucks != i) {
					document.getElementById(`fishbuck-slot-${player["id"]}-${i}`).style.opacity = "0";
				}
			}

			playerBoard.insertAdjacentHTML("beforeend", `
				<div id="freshGrid-${player["id"]}" class="freshGrid"></div>
				<div id="spentGrid-${player["id"]}" class="spentGrid"></div>	
			`)

			this.freshStock[player["id"]] = new BgaCards.LineStock(this.diceManager, document.getElementById(`freshGrid-${player["id"]}`), {sort: BgaCards.sort('type_arg', 'type')});
			this.spentStock[player["id"]] = new BgaCards.LineStock(this.diceManager, document.getElementById(`spentGrid-${player["id"]}`), {sort: BgaCards.sort('type_arg', 'type')});
			Object.values(player.dice).forEach(die => {
				switch (die["location"]) {
					case "fresh":
						this.freshStock[player["id"]].addCard(die);
						break;
					case "spent":
						this.spentStock[player["id"]].addCard(die);
						break;
					default:
						this.showMessage(die["location"] + "has not yet been defined", "error");
						break;
				}
			})

			document.getElementById(`playerComponents-${player["id"]}`).insertAdjacentHTML("beforeend", `
				<div id="canOfWorms-${player["id"]}" class="canOfWorms provisions"></div>
				<div id="lifeboat-${player["id"]}" class="lifeboat provisions">
					<div id="lifeboat-inner-${player["id"]}" class="lifeboat-inner">
						<div id="lifeboat-front-${player["id"]}" class="lifeboat-front"></div>
						<div id="lifeboat-back-${player["id"]}" class="lifeboat-back"></div>
					</div>
				</div>
			`)

			console.log(player.provisions);
			if (!JSON.parse(player.provisions).lifeboat) {
				document.getElementById(`lifeboat-${player["id"]}`).classList.add("flipped");
			}
			
			if (!JSON.parse(player.provisions).canOfWorms) {
				document.getElementById(`canOfWorms-${player["id"]}`).style.backgroundPositionY = "-100%";
			}

			this.getPlayerPanelElement(parseInt(player["id"])).innerHTML = tmpl_playerBoard(player["id"], player.color, gamedatas.firstPlayer, gamedatas.lifePreserver);

			let tempDeck: number;
			if (player.location == "sea") {
				tempDeck = player.depth;
			} else {
				tempDeck = 0;
			}
			this.shipDecks[tempDeck].addCard({id: player["id"], colour: this.COLOUR_POSITION[player.color], location: player.location});
			document.getElementById(`madness_${this.MADNESS_LEVEL[player.regretCount]}_${this.COLOUR_POSITION[colour] / -100}`).style.opacity = "1";
		})
		
		for (let depth = 0; depth < 3; depth++) {
			let curDepth = [];
			for (let num = 0; num < 3; num++) {
				curDepth.push(new BgaCards.Deck(this.seaCardManager, document.getElementById(`shoal_${depth + 1}_${num + 1}`), {cardNumber: 0}));
			}
			this.shoalStocks.push(curDepth);
			this.graveyardStocks.push(new BgaCards.DiscardDeck(this.seaCardManager, document.getElementById(`shoal_${depth + 1}_graveyard`), {maxHorizontalShift: 0, maxVerticalShift: 0}));
		}

		let index = 0;
		this.shoalStocks.forEach(depth => {
			depth.forEach(shoal => {
				let curShoal = gamedatas.shoals[index];
				if (curShoal[3]) {
					shoal.addCard({id: curShoal[3]["name"], name: curShoal[3]["name"], depth: curShoal[2], size: curShoal[1], coords: curShoal[3]["coords"], difficulty: curShoal[3]["difficulty"], sell: curShoal[3]["sell"], type: curShoal[3]["type"]}, {initialSide: "front", finalSide: "front"});
				} else {
					let size = this.SHOAL_SIZE[curShoal[1]];
					let curDepth = curShoal[2]
					shoal.addCard({id: index - 9, size: size, depth: curDepth, coords: [-1, -1]}, {finalSide: "back"});
				}
				index++;
			})
		})

		this.regretDeck = new BgaCards.Deck(this.regretManager, document.getElementById(`regretDeck`), {cardNumber: gamedatas.regrets[0]});
		this.regretDiscard = new BgaCards.Deck(this.regretManager, document.getElementById(`regretDiscard`), {cardNumber: gamedatas.regrets[1]});

		this.reelsDeck = new BgaCards.Deck(this.reelsManager, document.getElementById(`reelsDeck`), {cardNumber: gamedatas.reels});
		this.rodsDeck = new BgaCards.Deck(this.rodsManager, document.getElementById(`rodsDeck`), {cardNumber: gamedatas.rods});
		this.suppliesDeck = new BgaCards.Deck(this.suppliesManager, document.getElementById(`suppliesDeck`), {cardNumber: gamedatas.supplies});

		for (let i = 1; i <= 6; i++) {
			document.getElementById("port_board").insertAdjacentHTML("beforeend", `
				<div id="day-${i}" class="dayTracker-slot"></div>
			`)

			if (i != gamedatas.day) {
				document.getElementById(`day-${i}`).style.opacity = "0";
			}
		}

		document.getElementById("game_play_area").insertAdjacentHTML("afterend", `
			<div id="icon_reference" class="tiny reference"></div>
			<div id="sea_reference" class="tiny reference"></div>
		`)
		document.getElementById("icon_reference").addEventListener("click", () => {
			if (document.getElementById("icon_reference").classList.contains("tiny")) {
				document.getElementById("icon_reference").classList.remove("tiny");
				document.getElementById("icon_reference").classList.add("large");
				document.getElementById("sea_reference").style.left = `310px`;
				document.getElementById("madness_board").style.left = `calc(${document.getElementById("madness_board").style.left} + 250px)`;
			} else {
				document.getElementById("icon_reference").classList.remove("large");
				document.getElementById("icon_reference").classList.add("tiny");
				document.getElementById("sea_reference").style.left = `60px`;
				document.getElementById("madness_board").style.left = `calc(${document.getElementById("madness_board").style.left} - 250px)`;
			}
		});
		document.getElementById("sea_reference").addEventListener("click", () => {
			if (document.getElementById("sea_reference").classList.contains("tiny")) {
				document.getElementById("sea_reference").classList.remove("tiny");
				document.getElementById("sea_reference").classList.add("large");
				document.getElementById("madness_board").style.left = `calc(${document.getElementById("madness_board").style.left} + 250px)`;
			} else {
				document.getElementById("sea_reference").classList.remove("large");
				document.getElementById("sea_reference").classList.add("tiny");
				document.getElementById("madness_board").style.left = `calc(${document.getElementById("madness_board").style.left} - 250px)`;
			}
		});

		this.dinkDeck = new BgaCards.Deck(this.dinksManager, document.getElementById("dink_deck"), {cardNumber: gamedatas.dinks, thicknesses: [0, 10, 20], shadowDirection: "top-right"});
	} 
	public onEnteringState(stateName: string, args: any) {
		switch (stateName) {
			case "LifePreserver":
				if (this.isCurrentPlayerActive()) {
					args.args.possibleChoices.forEach(id => {
						document.getElementById(`playerBoard-${id}`).classList.add("selectable");
						document.getElementById(`playerBoard-${id}`).addEventListener("click", () => {
							this.bgaPerformAction("actChooseLPPlayer", {"playerId": id});
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
								let curShoal = document.getElementById(`shoal_${i}_${j}`);
								curShoal.classList.add("selectable");
								curShoal.addEventListener("click", () => this.setClientState("client_ConfirmCast", {
									descriptionmyturn: "",
									args: {i: i, j: j}
								}));
							}
						}
						
						var lifeboat = document.getElementById(`lifeboat-${this.player_id}`);
						if (args.args.lifeboat) {
							lifeboat.classList.add("selectable");
							lifeboat.addEventListener("click", () => this.bgaPerformAction("actAbandonShip"));
						}
					}
				}

				if (args.args.casted) {
					console.log(args.args.selectedShoal);
					let shoal = [Math.floor(args.args.selectedShoal / 3) + 1, (args.args.selectedShoal - 1) % 3 + 1];
					document.getElementById(`shoal_${shoal[0]}_${shoal[1]}`).classList.add("selected");
				}
		}		
	}
	public onLeavingState(stateName: string) {
		document.querySelectorAll(".selectable").forEach(el => {
			el.classList.remove("selectable");
		})
	}
	public onUpdateActionButtons(stateName: string, args: any) {
		switch (stateName) {
			case "LifePreserver":
				if (this.isCurrentPlayerActive()) {
					args.possibleChoices.forEach(id => {
						this.statusBar.addActionButton(this.getFormattedPlayerName(id), () => this.bgaPerformAction("actChooseLPPlayer", {"playerId": id}), {"color": "secondary"});
					});
				}
				break;
			case "client_ConfirmCast":
				this.statusBar.addActionButton(_("Confirm"), () => {this.bgaPerformAction("actCast", {shoal: `${args.i}|${args.j}`}); this.restoreServerGameState()});
				this.statusBar.addActionButton(_("Cancel"), () => this.restoreServerGameState(), {color: "secondary"});
				break;
		}
	}
	public setupNotifications() {
		this.bgaSetupPromiseNotifications();
	}

	public notif_playerBoardSide(args) {
		let position: string;
		args.newSide == "monster" ? position = "-100%" : position = "0";
		document.getElementById(`playerBoard-${args.player_id}`).style.backgroundPositionX = position;
	}

	public notif_lifePreserver(args) {
		let lPPlayer = args.player_id2;
		this.getPlayerPanelElement(lPPlayer).insertAdjacentHTML("beforeend", `<div id="lifePreserverPanel"></div>`);
		this.animationManager.fadeIn(document.getElementById("lifePreserverPanel"), document.getElementById(`playerBoard-${args.player_id1}`), {duration: 1000})
	}

	public notif_selectedShoal(args) {
		document.querySelectorAll(".shoal.selectable").forEach(shoal => {
			shoal.classList.remove("selectable");
		})
		document.getElementById(`shoal_${args.shoal[0]}_${args.shoal[1]}`).classList.add("selected");
	}

	public notif_revealCard(args: any) {
		console.log(args);
		let fish = args.fish;
		this.shoalStocks[args.shoal[0] - 1][args.shoal[1] - 1].flipCard({id: args.shoalNum - 10, size: this.SHOAL_SIZE[fish.size], depth: args.depth, coords: fish.coords},
																		{updateData: true}
		)
	}

	public notif_abandonedShip(args: any) {
		document.getElementById(`lifeboat-${args.player_id}`).classList.add("flipped");
		document.getElementById(`lifeboat-${args.player_id}`).classList.remove("selectable");

		this.shipDecks[0].addCard({id: args.player_id, location: "port"})
	}
}