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
	private COLOUR_POSITION = {
		"488fc7": 0,
		"69ba35": -100,
		"ad3545": -200,
		"439ba0": -300,
		"cb5c21": -400
	}

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
						<div class="shoal" id="shoal_2_1"></div>
						<div class="shoal" id="shoal_3_1"></div>
						<div class="shoal" id="shoal_graveyard_1"></div>
						<div class="shoal" id="shoal_1_2"></div>
						<div class="shoal" id="shoal_2_2"></div>
						<div class="shoal" id="shoal_3_2"></div>
						<div class="shoal" id="shoal_graveyard_2"></div>
						<div class="shoal" id="shoal_1_3"></div>
						<div class="shoal" id="shoal_2_3"></div>
						<div class="shoal" id="shoal_3_3"></div>
						<div class="shoal" id="shoal_graveyard_3"></div>
					</div>
				</div>
				<div id="port_board" style="zoom: ${localStorage.getItem("port_board") || ((document.getElementById("board").clientWidth / 1500) > 1 ? document.getElementById("board").clientWidth / 1500 : 1)}">
					<div class="size_buttons">
						<div id="port_home" class="utility_button"></div>
						<div id="port_large" class="utility_button"></div>
						<div id="port_small" class="utility_button"></div>
					</div>
				</div>			
			</div>
			<div id="playerBoards"></div>
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
					boardWidth = 1500;
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
						curZoom + 0.1 <= Math.ceil((boards.clientWidth / boardWidth) * 10) / 10 ? newZoom = curZoom + 0.1 : newZoom = curZoom;
						break;
					case "small":
						curZoom > 0.1 ? newZoom = curZoom - 0.1 : newZoom = curZoom;
						break;
				}
				localStorage.setItem(board.id, newZoom.toString());
				(board.style as any).zoom = newZoom.toString();
			});
		});

		Object.entries(gamedatas.players).forEach(player => {
			let id: string = `playerBoard-${player[0]}`;
			let colour: string = (player[1] as any).color;
			let space: InsertPosition;
			if (player[0].toString() == this.player_id.toString()) {
				space = "afterbegin";
			} else {
				space = "beforeend";
			}
			document.getElementById("playerBoards").insertAdjacentHTML(space, `
				<div id="${id}" class="playerBoard"></div>
			`);
			let playerBoard: HTMLElement = document.getElementById(id);
			playerBoard.style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;
			let position: string;
			(player[1] as any).playerBoard == "monster" ? position = "0" : position = "-100%";
			playerBoard.style.backgroundPositionX = position;
			
			if (player[0].toString() == this.player_id.toString()) {
				playerBoard.addEventListener("click", () => {
					this.bgaPerformAction(`actChooseSide`, {curPlayer: player[0]}, {checkAction: false});
				});
			}

			for (let i = 0; i <= 10; i++) {
				playerBoard.insertAdjacentHTML("beforeend", `
					<div id="fishbuck-slot-${player[0]}-${i}" class="fishbuck-slot"></div>
				`);

				const style = document.createElement('style');
				
				const css = `
					@container playerBoard (width > 0px) {
						#fishbuck-slot-${player[0]}-${i} {
							left: ${i == 10 ? 90.6 : 41.1 + i * 4.9}cqw;
						}
					}
				`;
				style.appendChild(document.createTextNode(css));
				document.head.appendChild(style);

				document.getElementById(`fishbuck-slot-${player[0]}-${i}`).style.backgroundPositionY = `${this.COLOUR_POSITION[colour]}%`;

				if ((player[1] as any).fishbucks != i) {
					document.getElementById(`fishbuck-slot-${player[0]}-${i}`).style.opacity = "0";
				}
			}
		})

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
			} else {
				document.getElementById("icon_reference").classList.remove("large");
				document.getElementById("icon_reference").classList.add("tiny");
				document.getElementById("sea_reference").style.left = `60px`;
			}
		});
		document.getElementById("sea_reference").addEventListener("click", () => {
			if (document.getElementById("sea_reference").classList.contains("tiny")) {
				document.getElementById("sea_reference").classList.remove("tiny");
				document.getElementById("sea_reference").classList.add("large");
			} else {
				document.getElementById("sea_reference").classList.remove("large");
				document.getElementById("sea_reference").classList.add("tiny");
			}
		});
	} 
	public onEnteringState(stateName: string, args: any) {}
	public onLeavingState(stateName: string) {}
	public onUpdateActionButtons(stateName: string, args: any) {} 
	public clientStateTest(args: string): void {}
	public setupNotifications() {
		this.bgaSetupPromiseNotifications();
	}

	public notif_playerBoardSide(args) {
		let position: string;
		args.newSide == "monster" ? position = "-100%" : position = "0";
		document.getElementById(`playerBoard-${args.player_id}`).style.backgroundPositionX = position;
	}
}