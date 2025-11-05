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
	constructor() {
		// @ts-ignore
		super();
	}
	
	public setup(gamedatas: any) {
		this.setupNotifications();

		document.getElementById("game_play_area").insertAdjacentHTML("beforeend", `
			<div id="boards">
				<div id="sea_board">
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
				<div id="port_board">
					<div class="size_buttons">
						<div id="port_home" class="utility_button"></div>
						<div id="port_large" class="utility_button"></div>
						<div id="port_small" class="utility_button"></div>
					</div>
				</div>			
			</div>
		`)

		document.querySelectorAll(".utility_button").forEach(button => {
			let id: string = button.id
			button.addEventListener("click", () => {
				let board: HTMLElement = document.getElementById(id.substring(0, id.indexOf("_")) + "_board");
				let curZoom: number = parseFloat((getComputedStyle(board) as any).zoom);
				let newZoom: number;
				switch (id.substring(id.indexOf("_") + 1)) {
					case "home":
						newZoom = 1;
						break;
					case "large":
						newZoom = curZoom + 0.1;
						break;
					case "small":
						newZoom = curZoom - 0.1;
						break;
				}
				(board.style as any).zoom = newZoom.toString();
			});
		});
	} 
	public onEnteringState(stateName: string, args: any) {}
	public onLeavingState(stateName: string) {}
	public onUpdateActionButtons(stateName: string, args: any) {
		switch (stateName) {
			case "Test":
				if (this.isCurrentPlayerActive()) {
					this.statusBar.addActionButton("Click me!", () => this.bgaPerformAction("actClickButton", {"player": this.player_id}));
				} else {
					this.statusBar.addActionButton("Activate again", () => this.bgaPerformAction("actActivate", {"player": this.player_id}, {checkAction: false}));
				}
				break;
		}
	} 
	public setupNotifications() {}
}