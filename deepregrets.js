/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * DeepRegrets implementation : © Connor Rask connor@srask.ca
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// @ts-ignore
GameGui = (function () {
    function GameGui() { }
    return GameGui;
})();
// Note: it does not really extend it in es6 way, you cannot call super you have to use dojo way 
var DeepRegrets = /** @class */ (function (_super) {
    __extends(DeepRegrets, _super);
    function DeepRegrets() {
        // @ts-ignore
        return _super.call(this) || this;
    }
    DeepRegrets.prototype.setup = function (gamedatas) {
        this.setupNotifications();
        document.getElementById("game_play_area").insertAdjacentHTML("beforeend", "\n\t\t\t<div id=\"boards\">\n\t\t\t\t<div id=\"sea_board\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"sea_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"shoal_grid\">\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_3\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div id=\"port_board\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"port_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\t\n\t\t\t</div>\n\t\t");
        document.querySelectorAll(".utility_button").forEach(function (button) {
            var id = button.id;
            button.addEventListener("click", function () {
                var board = document.getElementById(id.substring(0, id.indexOf("_")) + "_board");
                var curZoom = parseFloat(getComputedStyle(board).zoom);
                var newZoom;
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
                board.style.zoom = newZoom.toString();
            });
        });
    };
    DeepRegrets.prototype.onEnteringState = function (stateName, args) { };
    DeepRegrets.prototype.onLeavingState = function (stateName) { };
    DeepRegrets.prototype.onUpdateActionButtons = function (stateName, args) {
        var _this = this;
        switch (stateName) {
            case "Test":
                if (this.isCurrentPlayerActive()) {
                    this.statusBar.addActionButton("Click me!", function () { return _this.bgaPerformAction("actClickButton", { "player": _this.player_id }); });
                }
                else {
                    this.statusBar.addActionButton("Activate again", function () { return _this.bgaPerformAction("actActivate", { "player": _this.player_id }, { checkAction: false }); });
                }
                break;
        }
    };
    DeepRegrets.prototype.setupNotifications = function () { };
    return DeepRegrets;
}(GameGui));
define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
], function (dojo, declare) {
    return declare("bgagame.deepregrets", ebg.core.gamegui, new DeepRegrets());
});
