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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        _this.regretDeck = {};
        _this.regretDiscard = {};
        _this.freshStock = {};
        _this.spentStock = {};
        _this.shoalStocks = [];
        _this.graveyardStocks = [];
        _this.reelsDeck = {};
        _this.rodsDeck = {};
        _this.suppliesDeck = {};
        _this.shipDecks = [];
        _this.dinkDeck = {};
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
        _this.SHOAL_SIZE = {
            "small": 0,
            "middling": 1,
            "large": 2
        };
        _this.MADNESS_LEVEL = [
            0,
            1, 1, 1,
            2, 2, 2,
            3, 3, 3,
            4, 4, 4,
            5
        ];
        return _this;
    }
    DeepRegrets.prototype.setup = function (gamedatas) {
        var _this = this;
        this.setupNotifications();
        $("game_play_area").insertAdjacentHTML("beforeend", "\n\t\t\t<div id=\"boards\">\n\t\t\t\t<div id=\"sea_board\" style=\"zoom: ".concat(localStorage.getItem("sea_board") || (($("board").clientWidth / 726) > 1 ? $("board").clientWidth / 726 : 1), "\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"sea_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"sea_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"shoal_grid\">\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_1_graveyard\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_2_graveyard\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_1\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_2\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_3\"></div>\n\t\t\t\t\t\t<div class=\"shoal\" id=\"shoal_3_graveyard\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"ship_grid_sea\">\n\t\t\t\t\t\t<div id=\"ship_grid_1\" class=\"ship_depth\"></div>\n\t\t\t\t\t\t<div id=\"ship_grid_2\" class=\"ship_depth\"></div>\n\t\t\t\t\t\t<div id=\"ship_grid_3\" class=\"ship_depth\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"dink_deck\"></div>\n\t\t\t\t</div>\n\t\t\t\t<div id=\"port_board\" style=\"zoom: ").concat(localStorage.getItem("port_board") || (($("board").clientWidth / 1500) > 1 ? $("board").clientWidth / 1500 : 1), "\">\n\t\t\t\t\t<div class=\"size_buttons\">\n\t\t\t\t\t\t<div id=\"port_home\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_large\" class=\"utility_button\"></div>\n\t\t\t\t\t\t<div id=\"port_small\" class=\"utility_button\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"regret_grid\">\n\t\t\t\t\t\t<div class=\"regret\" id=\"regretDeck\"></div>\n\t\t\t\t\t\t<div class=\"regret\" id=\"regretDiscard\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"reelsDeck\" class=\"itemDeck\"></div>\n\t\t\t\t\t<div id=\"rodsDeck\" class=\"itemDeck\"></div>\n\t\t\t\t\t<div id=\"suppliesDeck\" class=\"itemDeck\"></div>\n\t\t\t\t\t<div id=\"ship_port\"></div>\n\t\t\t\t</div>\t\t\t\n\t\t\t</div>\n\t\t\t<div id=\"playerBoards\"></div>\n\t\t\t<div id=\"lineGrid\"></div>\n\t\t"));
        document.querySelectorAll(".utility_button").forEach(function (button) {
            var boards = $("boards");
            var id = button.id;
            var boardWidth;
            switch (id.substring(0, 1)) {
                case "s":
                    boardWidth = 726;
                    break;
                case "p":
                    boardWidth = 1740;
                    break;
            }
            button.addEventListener("click", function () {
                var board = $(id.substring(0, id.indexOf("_")) + "_board");
                var curZoom = parseFloat(getComputedStyle(board).zoom);
                var newZoom;
                switch (id.substring(id.indexOf("_") + 1)) {
                    case "home":
                        var temp = Math.floor((boards.clientWidth / boardWidth) * 10) / 10;
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
                board.style.zoom = newZoom.toString();
            });
        });
        window.addEventListener("resize", function () {
            var port = $("port_board");
            var boards = $("boards");
            if (1720 * port.style.zoom + 20 > boards.clientWidth) {
                port.style.zoom = boards.clientWidth / 1760;
            }
        });
        // create the animation manager, and bind it to the `game.bgaAnimationsActive()` function
        this.animationManager = new BgaAnimations.Manager({
            animationsActive: function () { return _this.bgaAnimationsActive(); },
        });
        // create the card manager
        this.seaCardManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'card',
            getId: function (card) { return card.id; },
            cardWidth: 156,
            cardHeight: 215,
            isCardVisible: function (card) {
                return card.coords[0] != -1;
            },
            fakeCardGenerator: function (deckId) {
                return { id: "fake", coords: [-1, -1] };
            },
            setupDiv: function (card, div) {
                div.dataset.type = card.type;
                div.dataset.typeArg = card.type_arg;
            },
            setupBackDiv: function (card, div) {
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/seaBacks.png)");
                div.style.backgroundSize = "300% 300%";
                div.style.borderRadius = "6px";
                div.style.backgroundPositionX = "-".concat(card.size, "00%");
                div.style.backgroundPositionY = "-".concat(card.depth - 1, "00%");
                _this.addTooltipHtml(div.id, "Fish in a shoal<br><strong>Depth:</strong> ".concat(card.depth, "<br><strong>Size:</strong> ").concat(toTitleCase(Object.keys(_this.SHOAL_SIZE).find(function (key) { return _this.SHOAL_SIZE[key] === card.size; }))));
            },
            setupFrontDiv: function (card, div) {
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/seaCards.png)");
                div.style.backgroundSize = "1300% 900%";
                div.style.borderRadius = "6px";
                if (card.coords[0] > -1) {
                    div.style.backgroundPositionX = "-".concat(card.coords[0], "00%");
                    div.style.backgroundPositionY = "-".concat(card.coords[1], "00%");
                }
                _this.addTooltipHtml(div.id, frontTooltipFish(card.coords, card.name, card.size, card.depth, card.type, card.sell, card.difficulty));
            },
        });
        // create the dice manager
        this.diceManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'dice',
            getId: function (dice) { return dice.id; },
            cardWidth: 95 / 2,
            cardHeight: 132 / 2,
            isCardVisible: function (card) { return true; },
            setupDiv: function (dice, div) {
                div.dataset.type = dice.type;
                div.dataset.typeArg = dice.type_arg;
            },
            setupFrontDiv: function (dice, div) {
                div.style.backgroundPositionX = "".concat(_this.DICE_POSITION[dice.type], "%");
                div.style.backgroundPositionY = "-".concat(dice.type_arg, "00%");
                div.style.backgroundSize = "900% 400%";
                _this.addTooltipHtml(div.id, "Dice in ".concat(dice.location, " pool"));
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/dice/sides.jpg)");
            },
            selectableCardStyle: { class: "selectable" },
            selectedCardStyle: { class: "selected" }
        });
        // create the regrets manager
        this.regretManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'regrets',
            getId: function (card) { return card.id; },
            cardWidth: 278,
            cardHeight: 396,
            setupDiv: function (card, div) {
                div.dataset.type = card.type;
                div.dataset.typeArg = card.type_arg;
            },
            setupBackDiv: function (card, div) {
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/regrets.png)");
                div.style.backgroundPosition = "0 0";
                div.style.backgroundSize = "1000% 700%";
                div.style.borderRadius = "12px";
            },
            setupFrontDiv: function (card, div) {
                div.style.backgroundPositionX = "-".concat(card.type % 10, "%");
                div.style.backgroundPositionY = "-".concat(Math.floor(card.type / 10));
                div.style.backgroundSize = "1000% 700%";
                div.style.borderRadius = "12px";
                _this.addTooltipHtml(div.id, "Regret of magnitude ".concat(card.type_arg));
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/regrets.png)");
            },
        });
        // create the rods / reels / supplies managers
        this.reelsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'reels',
            getId: function (card) { return card.id; },
            cardWidth: 350,
            cardHeight: 490,
            setupDiv: function (card, div) {
                div.dataset.type = card.type;
                div.dataset.typeArg = card.type_arg;
            },
            setupBackDiv: function (card, div) {
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/reels.png)");
                div.style.backgroundPosition = "0 0";
                div.style.backgroundSize = "500% 300%";
                div.style.borderRadius = "12px";
            },
            setupFrontDiv: function (card, div) {
                div.style.backgroundPositionX = "-".concat(card.type % 10, "%");
                div.style.backgroundPositionY = "-".concat(Math.floor(card.type / 10));
                div.style.backgroundSize = "500% 300%";
                div.style.borderRadius = "12px";
                _this.addTooltipHtml(div.id, "Reel");
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/reels.png)");
            },
        });
        this.rodsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'rods',
            getId: function (card) { return card.id; },
            cardWidth: 350,
            cardHeight: 490,
            setupDiv: function (card, div) {
                div.dataset.type = card.type;
                div.dataset.typeArg = card.type_arg;
            },
            setupBackDiv: function (card, div) {
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/rods.png)");
                div.style.backgroundPosition = "0 0";
                div.style.backgroundSize = "500% 300%";
                div.style.borderRadius = "12px";
            },
            setupFrontDiv: function (card, div) {
                div.style.backgroundPositionX = "-".concat(card.type % 10, "%");
                div.style.backgroundPositionY = "-".concat(Math.floor(card.type / 10));
                div.style.backgroundSize = "500% 300%";
                div.style.borderRadius = "12px";
                _this.addTooltipHtml(div.id, "Rod");
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/rods.png)");
            },
        });
        this.suppliesManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'rods',
            getId: function (card) { return card.id; },
            cardWidth: 350,
            cardHeight: 490,
            setupDiv: function (card, div) {
                div.dataset.type = card.type;
                div.dataset.typeArg = card.type_arg;
            },
            setupBackDiv: function (card, div) {
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/supplies.png)");
                div.style.backgroundPosition = "0 0";
                div.style.backgroundSize = "600% 400%";
                div.style.borderRadius = "12px";
            },
            setupFrontDiv: function (card, div) {
                div.style.backgroundPositionX = "-".concat(card.type % 10, "%");
                div.style.backgroundPositionY = "-".concat(Math.floor(card.type / 10));
                div.style.backgroundSize = "600% 400%";
                div.style.borderRadius = "12px";
                _this.addTooltipHtml(div.id, "Rod");
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/supplies.png)");
            },
        });
        // create the ships manager
        this.shipsManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'ships',
            getId: function (ship) { return ship.id; },
            cardWidth: 57,
            cardHeight: 38,
            isCardVisible: function (card) { return true; },
            setupDiv: function (ship, div) {
                div.dataset.type = ship.type;
                div.dataset.typeArg = ship.type_arg;
                div.style.boxShadow = "none";
            },
            setupFrontDiv: function (ship, div) {
                div.style.backgroundPositionX = "0";
                div.style.backgroundPositionY = "".concat(ship.colour, "%");
                div.style.backgroundSize = "100% 500%";
                div.style.boxShadow = "none";
                _this.addTooltipHtml(div.id, "Ship");
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/other/boats.png)");
            },
        });
        // create the dinks manager
        this.dinksManager = new BgaCards.Manager({
            animationManager: this.animationManager,
            type: 'dinks',
            getId: function (dink) { return -1; },
            cardWidth: 103,
            cardHeight: 147,
            isCardVisible: function (card) { return false; },
            setupDiv: function (dink, div) {
                // div.dataset.type = dink.type;
                // div.dataset.typeArg = dink.type_arg;
            },
            setupBackDiv: function (dink, div) {
                div.style.backgroundPosition = "0 0";
                div.style.backgroundSize = "700% 400%";
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/dinks.png)");
                div.style.borderRadius = "5px";
            },
            setupFrontDiv: function (dink, div) {
                div.style.backgroundSize = "700% 400%";
                div.style.boxShadow = "none";
                _this.addTooltipHtml(div.id, "Dink");
                div.style.backgroundImage = "url(".concat(g_gamethemeurl, "img/dinks.png)");
                div.style.borderRadius = "5px";
            },
        });
        // Ship stock setup
        for (var i = 0; i < 4; i++) {
            var el_1 = void 0;
            if (i == 0) {
                el_1 = $("ship_port");
            }
            else {
                el_1 = $("ship_grid_".concat(i));
            }
            this.shipDecks.push(new BgaCards.LineStock(this.shipsManager, el_1, { direction: "column", wrap: "nowrap" }));
        }
        // Madness board setup
        $("game_play_area").insertAdjacentHTML("afterend", "\n\t\t\t<div id=\"madness_board\">\n\t\t\t\t<div id=\"tinyMadness\" class=\"tiny\"></div>\n\t\t\t\t<div id=\"largeMadness\" class=\"tiny\">\n\t\t\t\t\t<div id=\"madnessGrid\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
        var mGrid = $("madnessGrid");
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                mGrid.insertAdjacentHTML("beforeend", "<div id=\"madness_".concat(i, "_").concat(j, "\" class=\"madnessSlot madness_").concat(j, "\"></div>"));
            }
        }
        var el = $("madness_board");
        el.style.left = "115px";
        el.addEventListener("click", function () {
            Array.from(el.children).forEach(function (child) {
                if (child.classList.contains("tiny")) {
                    child.classList.remove("tiny");
                    child.classList.add("large");
                }
                else {
                    child.classList.remove("large");
                    child.classList.add("tiny");
                }
            });
        });
        var playerOrder = [gamedatas.players[this.player_id]];
        var id = gamedatas.playerOrder[this.player_id];
        while (id != this.player_id) {
            playerOrder.push(gamedatas.players[id]);
            id = gamedatas.playerOrder[id];
        }
        playerOrder.forEach(function (player) {
            var id = "playerBoard-".concat(player["id"]);
            var colour = player.color;
            var space;
            if (player["id"].toString() == _this.player_id.toString()) {
                space = "afterbegin";
            }
            else {
                space = "beforeend";
            }
            $("playerBoards").insertAdjacentHTML(space, "\n\t\t\t\t<div id=\"playerComponents-".concat(player["id"], "\" class=\"playerComponents\"><div id=\"").concat(id, "\" class=\"playerBoard\"></div></div>\n\t\t\t"));
            var playerBoard = $(id);
            playerBoard.style.backgroundPositionY = "".concat(_this.COLOUR_POSITION[colour], "%");
            var position;
            player.playerBoard == "monster" ? position = "0" : position = "-100%";
            playerBoard.style.backgroundPositionX = position;
            if (player["id"].toString() == _this.player_id.toString()) {
                playerBoard.addEventListener("click", function (e) {
                    if (e.target != playerBoard)
                        return;
                    _this.bgaPerformAction("actChooseSide", { curPlayer: player["id"] }, { checkAction: false });
                });
                $("tinyMadness").style.backgroundPositionY = "".concat(_this.COLOUR_POSITION[colour], "%");
            }
            for (var i = 0; i <= 10; i++) {
                playerBoard.insertAdjacentHTML("beforeend", "\n\t\t\t\t\t<div id=\"fishbuck-slot-".concat(player["id"], "-").concat(i, "\" class=\"fishbuck-slot\"></div>\n\t\t\t\t"));
                if (i < 10) {
                    $("fishbuck-slot-".concat(player["id"], "-").concat(i)).style.left = "calc(295px + ".concat(i, " * 35.1px)");
                }
                else {
                    $("fishbuck-slot-".concat(player["id"], "-").concat(i)).style.left = "653px";
                }
                $("fishbuck-slot-".concat(player["id"], "-").concat(i)).style.backgroundPositionY = "".concat(_this.COLOUR_POSITION[colour], "%");
                if (player.fishbucks != i) {
                    $("fishbuck-slot-".concat(player["id"], "-").concat(i)).style.opacity = "0";
                }
            }
            playerBoard.insertAdjacentHTML("beforeend", "\n\t\t\t\t<div id=\"freshGrid-".concat(player["id"], "\" class=\"freshGrid\"></div>\n\t\t\t\t<div id=\"spentGrid-").concat(player["id"], "\" class=\"spentGrid\"></div>\t\n\t\t\t"));
            _this.freshStock[player["id"]] = new BgaCards.LineStock(_this.diceManager, $("freshGrid-".concat(player["id"])), { sort: BgaCards.sort('type_arg', 'type') });
            // TODO: change to scrollable?
            _this.spentStock[player["id"]] = new BgaCards.LineStock(_this.diceManager, $("spentGrid-".concat(player["id"])), { sort: BgaCards.sort('type_arg', 'type') });
            Object.values(player.dice).forEach(function (die) {
                switch (die["location"]) {
                    case "fresh":
                        _this.freshStock[player["id"]].addCard(die);
                        break;
                    case "spent":
                        _this.spentStock[player["id"]].addCard(die);
                        break;
                    default:
                        _this.showMessage(die["location"] + "has not yet been defined", "error");
                        break;
                }
            });
            _this.freshStock[player["id"]].onSelectionChange = function () {
                if ($("confirmButton")) {
                    $("confirmButton").disabled = _this.freshStock[player["id"]].getSelection().length == 0;
                }
            };
            $("playerComponents-".concat(player["id"])).insertAdjacentHTML("beforeend", "\n\t\t\t\t<div id=\"canOfWorms-".concat(player["id"], "\" class=\"canOfWorms provisions\">\n\t\t\t\t\t<div id=\"canOfWorms-inner-").concat(player["id"], "\" class=\"canOfWorms-inner\">\n\t\t\t\t\t\t<div id=\"canOfWorms-front-").concat(player["id"], "\" class=\"canOfWorms-front\"></div>\n\t\t\t\t\t\t<div id=\"canOfWorms-back-").concat(player["id"], "\" class=\"canOfWorms-back\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div id=\"lifeboat-").concat(player["id"], "\" class=\"lifeboat provisions\">\n\t\t\t\t\t<div id=\"lifeboat-inner-").concat(player["id"], "\" class=\"lifeboat-inner\">\n\t\t\t\t\t\t<div id=\"lifeboat-front-").concat(player["id"], "\" class=\"lifeboat-front\"></div>\n\t\t\t\t\t\t<div id=\"lifeboat-back-").concat(player["id"], "\" class=\"lifeboat-back\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t"));
            if (!JSON.parse(player.provisions).lifeboat) {
                $("lifeboat-".concat(player["id"])).classList.add("flipped");
            }
            if (!JSON.parse(player.provisions).canOfWorms) {
                $("canOfWorms-".concat(player["id"])).classList.add("flipped");
            }
            _this.getPlayerPanelElement(parseInt(player["id"])).innerHTML = tmpl_playerBoard(player["id"], player.color, gamedatas.firstPlayer, gamedatas.lifePreserver);
            var tempDeck;
            if (player.location == "sea") {
                tempDeck = player.depth;
            }
            else {
                tempDeck = 0;
            }
            _this.shipDecks[tempDeck].addCard({ id: player["id"], colour: _this.COLOUR_POSITION[player.color], location: player.location });
            $("madness_".concat(_this.MADNESS_LEVEL[player.regretCount], "_").concat(_this.COLOUR_POSITION[colour] / -100)).style.opacity = "1";
        });
        for (var depth = 0; depth < 3; depth++) {
            var curDepth = [];
            for (var num = 0; num < 3; num++) {
                curDepth.push(new BgaCards.Deck(this.seaCardManager, $("shoal_".concat(depth + 1, "_").concat(num + 1)), { cardNumber: 0, autoRemovePreviousCards: false }));
            }
            this.shoalStocks.push(curDepth);
            this.graveyardStocks.push(new BgaCards.DiscardDeck(this.seaCardManager, $("shoal_".concat(depth + 1, "_graveyard")), { maxHorizontalShift: 0, maxVerticalShift: 0 }));
        }
        var index = 0;
        this.shoalStocks.forEach(function (depth) {
            depth.forEach(function (shoal) {
                var curShoal = gamedatas.shoals[index];
                if (curShoal[3]) {
                    shoal.addCard(cardTemplate(curShoal[3]["name"], curShoal[1], curShoal[2], curShoal[3]["coords"], curShoal[3]["name"], curShoal[3]["type"], curShoal[3]["sell"], curShoal[3]["difficulty"]));
                }
                else {
                    var size = _this.SHOAL_SIZE[curShoal[1]];
                    var curDepth = curShoal[2];
                    console.log(cardTemplate(index - 9, size, curDepth));
                    shoal.addCard(cardTemplate(index - 9, size, curDepth), { finalSide: "back" });
                }
                index++;
            });
        });
        this.regretDeck = new BgaCards.Deck(this.regretManager, $("regretDeck"), { cardNumber: gamedatas.regrets[0] });
        this.regretDiscard = new BgaCards.Deck(this.regretManager, $("regretDiscard"), { cardNumber: gamedatas.regrets[1] });
        this.reelsDeck = new BgaCards.Deck(this.reelsManager, $("reelsDeck"), { cardNumber: gamedatas.reels });
        this.rodsDeck = new BgaCards.Deck(this.rodsManager, $("rodsDeck"), { cardNumber: gamedatas.rods });
        this.suppliesDeck = new BgaCards.Deck(this.suppliesManager, $("suppliesDeck"), { cardNumber: gamedatas.supplies });
        for (var i = 1; i <= 6; i++) {
            $("port_board").insertAdjacentHTML("beforeend", "\n\t\t\t\t<div id=\"day-".concat(i, "\" class=\"dayTracker-slot\"></div>\n\t\t\t"));
            if (i != gamedatas.day) {
                $("day-".concat(i)).style.opacity = "0";
            }
        }
        $("game_play_area").insertAdjacentHTML("afterend", "\n\t\t\t<div id=\"icon_reference\" class=\"tiny reference\"></div>\n\t\t\t<div id=\"sea_reference\" class=\"tiny reference\"></div>\n\t\t");
        $("icon_reference").addEventListener("click", function () {
            if ($("icon_reference").classList.contains("tiny")) {
                $("icon_reference").classList.remove("tiny");
                $("icon_reference").classList.add("large");
                $("sea_reference").style.left = "310px";
                $("madness_board").style.left = "calc(".concat($("madness_board").style.left, " + 250px)");
            }
            else {
                $("icon_reference").classList.remove("large");
                $("icon_reference").classList.add("tiny");
                $("sea_reference").style.left = "60px";
                $("madness_board").style.left = "calc(".concat($("madness_board").style.left, " - 250px)");
            }
        });
        $("sea_reference").addEventListener("click", function () {
            if ($("sea_reference").classList.contains("tiny")) {
                $("sea_reference").classList.remove("tiny");
                $("sea_reference").classList.add("large");
                $("madness_board").style.left = "calc(".concat($("madness_board").style.left, " + 250px)");
            }
            else {
                $("sea_reference").classList.remove("large");
                $("sea_reference").classList.add("tiny");
                $("madness_board").style.left = "calc(".concat($("madness_board").style.left, " - 250px)");
            }
        });
        this.dinkDeck = new BgaCards.Deck(this.dinksManager, $("dink_deck"), { cardNumber: gamedatas.dinks, thicknesses: [0, 10, 20], shadowDirection: "top-right" });
    };
    DeepRegrets.prototype.onEnteringState = function (stateName, args) {
        var _this = this;
        switch (stateName) {
            case "LifePreserver":
                if (this.isCurrentPlayerActive()) {
                    args.args.possibleChoices.forEach(function (id) {
                        $("playerBoard-".concat(id)).classList.add("selectable");
                        $("playerBoard-".concat(id)).addEventListener("click", function (e) {
                            if (_this.gamedatas.gamestate.name == stateName) {
                                _this.bgaPerformAction("actChooseLPPlayer", { "playerId": id });
                            }
                        });
                    });
                }
                break;
            case "SeaActions":
                // TODO use "allowed" class: only trigger certain events if class is on object
                if (this.isCurrentPlayerActive()) {
                    if (!args.args.casted) {
                        var depth = parseInt(args.args.depth);
                        var _loop_1 = function (i) {
                            var _loop_2 = function (j) {
                                var curShoal = $("shoal_".concat(i, "_").concat(j));
                                curShoal.classList.add("selectable");
                                curShoal.addEventListener("click", function (e) {
                                    if (_this.gamedatas.gamestate.name == stateName) {
                                        console.log(_this.gamedatas.gamestate.name);
                                        _this.setClientState("client_Confirm", {
                                            descriptionmyturn: "Choose a shoal to cast in: ",
                                            args: { name: "actCast", args: { shoal: "".concat(i, "|").concat(j) }, selectedId: "shoal_".concat(i, "_").concat(j) }
                                        });
                                        console.log(_this.gamedatas.gamestate.name);
                                    }
                                });
                            };
                            for (var j = 1; j <= 3; j++) {
                                _loop_2(j);
                            }
                        };
                        for (var i = 1; i <= depth; i++) {
                            _loop_1(i);
                        }
                    }
                }
                break;
            case "FinishFish":
                var shoalArr = shoalnumToArr(args.args.selected);
                var shoal = $("shoal_".concat(shoalArr[0], "_").concat(shoalArr[1]));
                shoal.classList.add("selected");
                break;
            case "client_FreeSeaActions":
                var lifeboat = $("lifeboat-".concat(this.player_id));
                if (args.args.lifeboat) {
                    lifeboat.classList.add("selectable");
                    lifeboat.addEventListener("click", function (e) {
                        if (_this.gamedatas.gamestate.name == stateName) {
                            _this.bgaPerformAction("actAbandonShip");
                        }
                    });
                }
                var canOfWorms = $("canOfWorms-".concat(this.player_id));
                console.log(canOfWorms);
                console.log(args.args);
                if (args.args.canOfWorms) {
                    canOfWorms.classList.add("selectable");
                    canOfWorms.addEventListener("click", function (e) {
                        if (_this.gamedatas.gamestate.name == stateName) {
                            _this.setClientState("client_CanOfWorms", { "descriptionmyturn": "Choose a shoal to peek at" });
                        }
                    });
                }
                this.freshStock[this.player_id].setSelectionMode("none");
                break;
            case "client_DropSinker":
                this.freshStock[this.player_id].setSelectionMode("single");
                break;
            case "client_CanOfWorms":
                this.shoalStocks.forEach(function (depth) {
                    depth.forEach(function (shoal) {
                        shoal.element.classList.add("selectable");
                        shoal.element.addEventListener("click", function () {
                            if (_this.gamedatas.gamestate.name == stateName) {
                                document.querySelectorAll(".selected").forEach(function (el) {
                                    el.classList.remove("selected");
                                });
                                shoal.element.classList.add("selected");
                                $("confirmButton").disabled = false;
                            }
                        });
                    });
                });
                break;
            case "CanOfWorms":
                $("shoal_".concat(args.args.shoal[0], "_").concat(args.args.shoal[1])).classList.add("selected");
                if (this.isCurrentPlayerActive()) {
                    var fish = args.args["_private"].fish;
                    this.shoalStocks[args.args.shoal[0] - 1][args.args.shoal[1] - 1].flipCard({ id: args.args.shoalNum - 10, size: this.SHOAL_SIZE[fish.size], depth: fish.depth, coords: fish.coords }, { updateData: true });
                }
                break;
            case "client_Confirm":
                if (args.args.selectedId) {
                    $(args.args.selectedId).classList.add("selected");
                }
                break;
        }
    };
    DeepRegrets.prototype.onLeavingState = function (stateName) {
        document.querySelectorAll(".selectable").forEach(function (el) {
            el.classList.remove("selectable");
        });
        document.querySelectorAll(".selected").forEach(function (el) {
            el.classList.remove("selected");
        });
    };
    DeepRegrets.prototype.onUpdateActionButtons = function (stateName, args) {
        var _this = this;
        if (this.isCurrentPlayerActive()) {
            switch (stateName) {
                case "LifePreserver":
                    args.possibleChoices.forEach(function (id) {
                        _this.statusBar.addActionButton(_this.getFormattedPlayerName(id), function () { return _this.bgaPerformAction("actChooseLPPlayer", { "playerId": id }); }, { "color": "secondary" });
                    });
                    break;
                case "SeaActions":
                    this.statusBar.addActionButton(_("Free Actions"), function () { return _this.setClientState("client_FreeSeaActions", { "descriptionmyturn": "Perform free actions:", args: { "lifeboat": args.lifeboat, "dice": args.dice, "canOfWorms": args.canOfWorms } }); }, { color: "secondary" });
                    break;
                case "client_FinishFish":
                    this.statusBar.addActionButton(_("Confirm"), function () { return _this.bgaPerformAction("actFinishFish"); });
                    break;
                case "client_FreeSeaActions":
                    this.statusBar.addActionButton(_("Abandon Ship"), function () { return _this.bgaPerformAction("actAbandonShip"); }, { "color": "secondary" });
                    this.statusBar.addActionButton(_("Drop Sinker"), function () { return _this.setClientState("client_DropSinker", { "descriptionmyturn": "Choose a die to use" }); }, { "color": "secondary" });
                    if (args.canOfWorms) {
                        this.statusBar.addActionButton(_("Use Can of Worms"), function () { return _this.setClientState("client_CanOfWorms", { "descriptionmyturn": "Choose a shoal to peek at" }); }, { "color": "secondary" });
                    }
                    this.statusBar.addActionButton(_("Exit"), function () { return _this.restoreServerGameState(); }, { color: "alert" });
                    break;
                case "client_DropSinker":
                    this.statusBar.addActionButton(_("Confirm"), function () {
                        _this.bgaPerformAction("actDropSinker", { dice: _this.freshStock[_this.player_id].getSelection()[0].id });
                    }, { color: "primary", disabled: true, id: "confirmButton" });
                    this.statusBar.addActionButton(_("Cancel"), function () { return _this.setClientState("client_FreeSeaActions", { "descriptionmyturn": "Perform free actions" }); }, { color: "alert" });
                    break;
                case "client_CanOfWorms":
                    this.statusBar.addActionButton(_("Confirm"), function () {
                        var id = document.querySelector(".selected").id;
                        var split = id.split("_").slice(1);
                        var shoalNum = (parseInt(split[0]) - 1) * 3 + parseInt(split[1]);
                        _this.bgaPerformAction("actCanOfWorms", { shoalNum: shoalNum });
                    }, { color: "primary", disabled: true, id: "confirmButton" });
                    this.statusBar.addActionButton(_("Cancel"), function () { return _this.setClientState("client_FreeSeaActions", { "descriptionmyturn": "Perform free actions" }); }, { color: "alert" });
                    break;
                case "CanOfWorms":
                    this.statusBar.addActionButton(_("Top"), function () { return _this.bgaPerformAction("actSetPlace", { "place": "top" }); });
                    this.statusBar.addActionButton(_("Bottom"), function () { return _this.bgaPerformAction("actSetPlace", { "place": "bottom" }); });
                    break;
                case "client_Confirm":
                    this.statusBar.addActionButton(_("Confirm"), function () { _this.bgaPerformAction(args.name, args.args); _this.restoreServerGameState(); });
                    this.statusBar.addActionButton(_("Cancel"), function () { return _this.restoreServerGameState(); }, { color: "alert" });
                    break;
            }
        }
    };
    DeepRegrets.prototype.setupNotifications = function () {
        this.bgaSetupPromiseNotifications();
    };
    DeepRegrets.prototype.notif_playerBoardSide = function (args) {
        var position;
        args.newSide == "monster" ? position = "-100%" : position = "0";
        $("playerBoard-".concat(args.player_id)).style.backgroundPositionX = position;
    };
    DeepRegrets.prototype.notif_lifePreserver = function (args) {
        var lPPlayer = args.player_id2;
        this.getPlayerPanelElement(lPPlayer).insertAdjacentHTML("beforeend", "<div id=\"lifePreserverPanel\"></div>");
        this.animationManager.fadeIn($("lifePreserverPanel"), $("playerBoard-".concat(args.player_id1)), { duration: 1000 });
    };
    DeepRegrets.prototype.notif_selectedShoal = function (args) {
        document.querySelectorAll(".shoal.selectable").forEach(function (shoal) {
            shoal.classList.remove("selectable");
        });
        $("shoal_".concat(args.shoal[0], "_").concat(args.shoal[1])).classList.add("selected");
    };
    DeepRegrets.prototype.notif_revealCard = function (args) {
        var fish = args.fish;
        this.shoalStocks[args.shoal[0] - 1][args.shoal[1] - 1].flipCard({ id: args.shoalNum - 10, size: this.SHOAL_SIZE[fish.size], depth: args.depth, coords: fish.coords }, { updateData: true });
    };
    DeepRegrets.prototype.notif_abandonedShip = function (args) {
        $("lifeboat-".concat(args.player_id)).classList.add("flipped");
        $("lifeboat-".concat(args.player_id)).classList.remove("selectable");
        this.shipDecks[0].addCard({ id: args.player_id, location: "port" });
    };
    DeepRegrets.prototype.notif_dropSinker = function (args) {
        this.shipDecks[args.depth2].addCard({ id: args.player_id });
        this.spentStock[args.player_id].addCard({ id: args.dice });
        this.setClientState("client_FreeSeaActions", { "descriptionmyturn": "Perform free actions" });
    };
    DeepRegrets.prototype.notif_canOfWormsMove = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].flipCard({ id: args.shoalNum - 10, coords: [-1, -1] });
                        $('canOfWorms-' + this.getActivePlayerId()).classList.add("flipped");
                        if (!(args.place == "bottom")) return [3 /*break*/, 8];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].addCard(cardTemplate("temp", this.SHOAL_SIZE[args.newTop[0]], args.depth), { fadeIn: false, duration: 0, index: 0 })];
                    case 2:
                        _a.sent();
                        $('card-' + (args.shoalNum - 10)).style.zIndex = "3";
                        $('card-temp').style.zIndex = "2";
                        $('card-' + (args.shoalNum - 10)).style.transform = 'translateX(30%)';
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                    case 3:
                        _a.sent();
                        $('card-' + (args.shoalNum - 10)).style.zIndex = "1";
                        $('card-' + (args.shoalNum - 10)).style.transform = '';
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].removeCard({ id: args.shoalNum - 10, coords: [-1, -1] }, { autoUpdateCardNumber: false })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].addCard(cardTemplate(args.shoalNum - 10, this.SHOAL_SIZE[args.newTop[0]], args.depth), { fadeIn: false, duration: 0, index: 0 })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.shoalStocks[args.depth - 1][(args.shoalNum - 1) % 3].removeCard({ id: "temp", coords: [-1, -1] }, { autoUpdateCardNumber: false })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DeepRegrets.prototype.notif_test = function (args) {
        console.log(args);
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
var tmpl_playerBoard = function (id, colour, firstPlayer, lifePreserver) { return "\n    ".concat(firstPlayer == id ? "<div id=\"firstPlayerPanel\"></div>" : "", "\n    ").concat(lifePreserver == id ? "<div id=\"lifePreserverPanel\"></div>" : "", "\n"); };
var frontTooltipFish = function (coords, name, size, depth, type, sell, difficulty) { return "\n    <div class=\"fishTooltipGrid\">\n        <div class=\"fishTooltipImg\" style=\"background-position: -".concat(coords[0], "00% -").concat(coords[1], "00%\"></div>\n        <div class=\"fishTooltipText\">\n            <div><strong>Name: </strong>").concat(name, "</div>\n            <div><strong>Size: </strong>").concat(toTitleCase(size), "</div>\n            <div><strong>Depth: </strong>").concat(depth, "</div>\n            <div><strong>Type: </strong>").concat(toTitleCase(type), "</div>\n            <div><strong>Sell Value: </strong>").concat(sell, "</div>\n            <div><strong>Difficulty: </strong>").concat(difficulty, "</div>\n        </div>\n    </div>\n"); };
function toTitleCase(str) {
    return typeof str == "string" ? str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase() : str;
}
function cardTemplate(id, size, depth, coords, name, type, sell, difficulty) {
    if (coords === void 0) { coords = [-1, -1]; }
    if (name === void 0) { name = null; }
    if (type === void 0) { type = null; }
    if (sell === void 0) { sell = null; }
    if (difficulty === void 0) { difficulty = null; }
    return { id: id, coords: coords, name: name, size: size, depth: depth, type: type, sell: sell, difficulty: difficulty };
}
function shoalnumToArr(num) {
    return [Math.floor((num - 1) / 3) + 1, (num - 1) % 3 + 1];
}
function arrToShoalNum(arr) {
    return (arr[0] - 1) * 3 + arr[1];
}
