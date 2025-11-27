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
        var _this = 
        // @ts-ignore
        _super.call(this) || this;
        _this.freshStock = {};
        _this.spentStock = {};
        _this.COLOUR_POSITION = {
            "488fc7": 0,
            "69ba35": -100,
            "ad3545": -200,
            "439ba0": -300,
            "cb5c21": -400
        };
        _this.DICE_POSITION = {
            "blueP": 0,
            "blueT": -100,
            "greenP": -200,
            "greenT": -300,
            "omen": -400,
            "redP": -500,
            "tealP": -600,
            "orangeP": -700,
            "orangeT": -800
        };
        return _this;
    }
    DeepRegrets.prototype.setup = function (gamedatas) {
        var _this = this;
        this.setupNotifications();
        document.getElementById("game_play_area").insertAdjacentHTML("beforeend", "\n\t\t\t<div id=\"boards\">\n\t\t\t\t<div id=\"sea_board\" style=\"zoom: ".concat(localStorage.getItem("sea_board") || ((document.getElementById("board").clientWidth / 726) > 1 ? document.getElementById("board").clientWidth / 726 : 1), "\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"sea_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"shoal_grid\">\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_graveyard_3\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div id=\"port_board\" style=\"zoom: ").concat(localStorage.getItem("port_board") || ((document.getElementById("board").clientWidth / 1500) > 1 ? document.getElementById("board").clientWidth / 1500 : 1), "\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"port_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\t\n\t\t\t</div>\n\t\t\t<div id=\"playerBoards\"></div>\n\t\t\t<div id=\"lineGrid\"></div>\n\t\t"));
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
        // create the animation manager, and bind it to the `game.bgaAnimationsActive()` function
        this.animationManager = new BgaAnimations.Manager({
            animationsActive: function () { return _this.bgaAnimationsActive(); },
        });
        // create the card manager
        this.diceManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'dice',
            getId: function (dice) { return dice.id; },
            cardWidth: 95 / 2,
            cardHeight: 132 / 2,
            setupDiv: function (dice, div) {
                div.dataset.type = dice.type;
                div.dataset.typeArg = dice.type_arg;
            },
            setupFrontDiv: function (dice, div) {
                div.style.backgroundPositionX = "".concat(_this.DICE_POSITION[dice.type], "%");
                div.style.backgroundPositionY = "-".concat(dice.type_arg, "00%");
                div.style.backgroundSize = "900% 400%";
                _this.addTooltipHtml(div.id, "Dice in ".concat(dice.location, " pool"));
            },
        });
        Object.entries(gamedatas.players).forEach(function (player) {
            var id = "playerBoard-".concat(player[0]);
            var colour = player[1].color;
            var space;
            if (player[0].toString() == _this.player_id.toString()) {
                space = "afterbegin";
            }
            else {
                space = "beforeend";
            }
            document.getElementById("playerBoards").insertAdjacentHTML(space, "\n\t\t\t\t<div id=\"".concat(id, "\" class=\"playerBoard\"></div>\n\t\t\t"));
            var playerBoard = document.getElementById(id);
            playerBoard.style.backgroundPositionY = "".concat(_this.COLOUR_POSITION[colour], "%");
            var position;
            player[1].playerBoard == "monster" ? position = "0" : position = "-100%";
            playerBoard.style.backgroundPositionX = position;
            if (player[0].toString() == _this.player_id.toString()) {
                playerBoard.addEventListener("click", function () {
                    _this.bgaPerformAction("actChooseSide", { curPlayer: player[0] }, { checkAction: false });
                });
            }
            for (var i = 0; i <= 10; i++) {
                playerBoard.insertAdjacentHTML("beforeend", "\n\t\t\t\t\t<div id=\"fishbuck-slot-".concat(player[0], "-").concat(i, "\" class=\"fishbuck-slot\"></div>\n\t\t\t\t"));
                if (i < 10) {
                    document.getElementById("fishbuck-slot-".concat(player[0], "-").concat(i)).style.left = "calc(296px + ".concat(i, " * 35.2px)");
                }
                else {
                    document.getElementById("fishbuck-slot-".concat(player[0], "-").concat(i)).style.left = "653px";
                }
                document.getElementById("fishbuck-slot-".concat(player[0], "-").concat(i)).style.backgroundPositionY = "".concat(_this.COLOUR_POSITION[colour], "%");
                if (player[1].fishbucks != i) {
                    document.getElementById("fishbuck-slot-".concat(player[0], "-").concat(i)).style.opacity = "0";
                }
            }
            playerBoard.insertAdjacentHTML("beforeend", "\n\t\t\t\t<div id=\"freshGrid-".concat(player[0], "\" class=\"freshGrid\"></div>\n\t\t\t\t<div id=\"spentGrid-").concat(player[0], "\" class=\"spentGrid\"></div>\t\n\t\t\t"));
            _this.freshStock[player[0]] = new BgaCards.LineStock(_this.diceManager, document.getElementById("freshGrid-".concat(player[0])), { sort: BgaCards.sort('type_arg', 'type') });
            _this.spentStock[player[0]] = new BgaCards.LineStock(_this.diceManager, document.getElementById("spentGrid-".concat(player[0])), { sort: BgaCards.sort('type_arg', 'type') });
            Object.values(player[1].dice).forEach(function (die) {
                switch (die["location"]) {
                    case "fresh":
                        _this.freshStock[player[0]].addCard(die);
                        break;
                    case "spent":
                        _this.spentStock[player[0]].addCard(die);
                        break;
                    default:
                        _this.showMessage(die["location"] + "has not yet been defined", "error");
                        break;
                }
            });
        });
        // this.freshStock = new BgaCards.LineStock(this.diceManager, document.getElementById("lineGrid"));
        // (this.freshStock as any).addCard({id: 1, type: "redP", type_arg: 1, location: "fresh", location_arg: 0});
        // console.log(this.freshStock);
        for (var i = 1; i <= 6; i++) {
            document.getElementById("port_board").insertAdjacentHTML("beforeend", "\n\t\t\t\t<div id=\"day-".concat(i, "\" class=\"dayTracker-slot\"></div>\n\t\t\t"));
            if (i != gamedatas.day) {
                document.getElementById("day-".concat(i)).style.opacity = "0";
            }
        }
        document.getElementById("game_play_area").insertAdjacentHTML("afterend", "\n\t\t\t<div id=\"icon_reference\" class=\"tiny reference\"></div>\n\t\t\t<div id=\"sea_reference\" class=\"tiny reference\"></div>\n\t\t");
        document.getElementById("icon_reference").addEventListener("click", function () {
            if (document.getElementById("icon_reference").classList.contains("tiny")) {
                document.getElementById("icon_reference").classList.remove("tiny");
                document.getElementById("icon_reference").classList.add("large");
                document.getElementById("sea_reference").style.left = "310px";
            }
            else {
                document.getElementById("icon_reference").classList.remove("large");
                document.getElementById("icon_reference").classList.add("tiny");
                document.getElementById("sea_reference").style.left = "60px";
            }
        });
        document.getElementById("sea_reference").addEventListener("click", function () {
            if (document.getElementById("sea_reference").classList.contains("tiny")) {
                document.getElementById("sea_reference").classList.remove("tiny");
                document.getElementById("sea_reference").classList.add("large");
            }
            else {
                document.getElementById("sea_reference").classList.remove("large");
                document.getElementById("sea_reference").classList.add("tiny");
            }
        });
    };
    DeepRegrets.prototype.onEnteringState = function (stateName, args) { };
    DeepRegrets.prototype.onLeavingState = function (stateName) { };
    DeepRegrets.prototype.onUpdateActionButtons = function (stateName, args) { };
    DeepRegrets.prototype.clientStateTest = function (args) { };
    DeepRegrets.prototype.setupNotifications = function () {
        this.bgaSetupPromiseNotifications();
    };
    DeepRegrets.prototype.notif_playerBoardSide = function (args) {
        var position;
        args.newSide == "monster" ? position = "-100%" : position = "0";
        document.getElementById("playerBoard-".concat(args.player_id)).style.backgroundPositionX = position;
    };
    return DeepRegrets;
}(GameGui));
define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    getLibUrl('bga-animations', '1.x'),
    getLibUrl('bga-cards', '1.x')
], function (dojo, declare, gamegui, counter, BgaAnimations, BgaCards) {
    window.BgaAnimations = BgaAnimations;
    window.BgaCards = BgaCards;
    return declare("bgagame.deepregrets", ebg.core.gamegui, new DeepRegrets());
});
// Three equations for brightness of dice based on rotation
// Depends on angle: main side, top side, bottom side (45deg off each other)
/*
<div id="scene">
    <div class="redP" id="dice">
        <div class="face" id="f1"></div>
        <div class="face" id="f2"></div>
        <div class="face" id="f3"></div>
        <div class="face" id="f4"></div>
        <div class="triangle top" id="t1"></div>
        <div class="triangle top" id="t2"></div>
        <div class="triangle top" id="t3"></div>
        <div class="triangle top" id="t4"></div>
        <div class="triangle bottom" id="t5"></div>
        <div class="triangle bottom" id="t6"></div>
        <div class="triangle bottom" id="t7"></div>
        <div class="triangle bottom" id="t8"></div>
    </div>
</div>
 */
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
