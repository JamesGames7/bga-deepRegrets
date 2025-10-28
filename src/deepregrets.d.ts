interface YourGameNamePlayer extends Player {
    cards: Card[]; // any information you add on each result['players']
}

interface YourGameNameGamedatas extends Gamedatas<YourGameNamePlayer> {
    // Add here variables you set up in getAllDatas
    discardedCards: { [row: number]: Card[] };
    remainingCardsInDecks: { [row: number]: number };
    tableCards: { [row: number]: Card[] };
}