/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * DeepRegrets implementation : © Connor Rask connor@srask.ca
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

interface DeepRegretsPlayer extends Player {
    cards: Card[]; // any information you add on each result['players']
}

interface DeepRegretsGamedatas extends Gamedatas<DeepRegretsPlayer> {
    // Add here variables you set up in getAllDatas
    discardedCards: { [row: number]: Card[] };
    remainingCardsInDecks: { [row: number]: number };
    tableCards: { [row: number]: Card[] };
}