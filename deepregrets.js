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
        document.getElementById("game_play_area").insertAdjacentHTML("beforeend", "\n\t\t\t<div id=\"scene\">\n\t\t\t\t<div class=\"redP\" id=\"dice\">\n\t\t\t\t\t<div class=\"face\" id=\"f1\"></div>\n\t\t\t\t\t<div class=\"face\" id=\"f2\"></div>\n\t\t\t\t\t<div class=\"face\" id=\"f3\"></div>\n\t\t\t\t\t<div class=\"face\" id=\"f4\"></div>\n\t\t\t\t\t<div class=\"triangle top\" id=\"t1\"></div>\n\t\t\t\t\t<div class=\"triangle top\" id=\"t2\"></div>\n\t\t\t\t\t<div class=\"triangle top\" id=\"t3\"></div>\n\t\t\t\t\t<div class=\"triangle top\" id=\"t4\"></div>\n\t\t\t\t\t<div class=\"triangle bottom\" id=\"t5\"></div>\n\t\t\t\t\t<div class=\"triangle bottom\" id=\"t6\"></div>\n\t\t\t\t\t<div class=\"triangle bottom\" id=\"t7\"></div>\n\t\t\t\t\t<div class=\"triangle bottom\" id=\"t8\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div id=\"boards\">\n\t\t\t\t<div id=\"sea_board\" style=\"zoom: ".concat(localStorage.getItem("sea_board") || ((document.getElementById("board").clientWidth / 726) > 1 ? document.getElementById("board").clientWidth / 726 : 1), "\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"sea_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"shoal_grid\">\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_3\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div id=\"port_board\" style=\"zoom: ").concat(localStorage.getItem("port_board") || ((document.getElementById("board").clientWidth / 1500) > 1 ? document.getElementById("board").clientWidth / 1500 : 1), "\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"port_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\t\n\t\t\t</div>\n\t\t"));
        diceSetup("dice");
        diceRotation("dice");
        document.querySelectorAll(".utility_button").forEach(function (button) {
            var boards = document.getElementById("boards");
            var id = button.id;
            var boardWidth;
            switch (id.substring(0, 1)) {
                case "s":
                    boardWidth = 726;
                    break;
                case "p":
                    boardWidth = 1500;
                    break;
            }
            button.addEventListener("click", function () {
                var board = document.getElementById(id.substring(0, id.indexOf("_")) + "_board");
                var curZoom = parseFloat(getComputedStyle(board).zoom);
                var newZoom;
                switch (id.substring(id.indexOf("_") + 1)) {
                    case "home":
                        var temp = Math.floor((boards.clientWidth / boardWidth) * 10) / 10;
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
                board.style.zoom = newZoom.toString();
            });
        });
    };
    DeepRegrets.prototype.onEnteringState = function (stateName, args) { };
    DeepRegrets.prototype.onLeavingState = function (stateName) { };
    DeepRegrets.prototype.onUpdateActionButtons = function (stateName, args) { };
    DeepRegrets.prototype.clientStateTest = function (args) { };
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
// Three equations for brightness of dice based on rotation
// Depends on angle: main side, top side, bottom side (45deg off each other)
var faceEq = function (x) { return (1 / 4 * Math.cos(-19 * Math.PI / 180 * Math.cos(x + Math.PI / 4) + Math.PI / 2) + 9 / 10); };
var topEq = function (x) { return (1 / 4 * Math.cos(-19 * Math.PI / 180 * Math.cos(x + Math.PI / 4) + Math.PI / 4) + 9 / 10); };
var bottomEq = function (x) { return (1 / 4 * Math.cos(-19 * Math.PI / 180 * Math.cos(x + Math.PI / 4) + 3 * Math.PI / 4) + 9 / 10); };
// Original setup of dice
function diceSetup(elementId) {
    // Element to apply to
    var el = document.getElementById(elementId);
    // Finding the rotation on correct axis
    var style = window.getComputedStyle(el).transform;
    var rotateY;
    if (style.includes("matrix3d")) {
        var matrix = style.slice(9, -1).split(",").map(parseFloat);
        rotateY = -Math.atan2(matrix[2], matrix[0]);
    }
    else {
        rotateY = 0;
    }
    // For each side (90deg off each other)
    var add = 0;
    ["f1", "f2", "f3", "f4"].forEach(function (id) {
        document.getElementById(id).style.filter = "brightness(".concat(faceEq(rotateY + add), ")");
        add += Math.PI / 2;
    });
    ["t1", "t2", "t3", "t4"].forEach(function (id) {
        document.getElementById(id).style.filter = "brightness(".concat(topEq(rotateY + add), ")");
        add += Math.PI / 2;
    });
    ["t5", "t6", "t7", "t8"].forEach(function (id) {
        document.getElementById(id).style.filter = "brightness(".concat(bottomEq(rotateY + add), ")");
        add += Math.PI / 2;
    });
}
// EventListener for when it rotates (for now click)
function diceRotation(elementId) {
    var el = document.getElementById(elementId);
    var rot = 0;
    el.addEventListener("click", function () {
        // Set rotation / transformation
        rot += 810;
        el.style.transform = "rotateY(".concat(rot, "deg)");
        // Start time
        var start = performance.now();
        function update(t) {
            // Find how long it's been
            var progress = Math.min((t - start) / 1000, 2);
            diceSetup(el.id);
            // Recursively repeat until done
            if (progress < 2)
                requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}
window.diceSetup = diceSetup;
window.diceRotation = diceRotation;
