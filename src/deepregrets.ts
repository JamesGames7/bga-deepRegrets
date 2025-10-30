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