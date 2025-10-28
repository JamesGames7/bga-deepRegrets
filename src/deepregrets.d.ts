interface DeepRegretsPlayer extends Player {
    cards: Card[]; // any information you add on each result['players']
}

interface DeepRegretsGamedatas extends Gamedatas<DeepRegretsPlayer> {
    // Add here variables you set up in getAllDatas
    discardedCards: { [row: number]: Card[] };
    remainingCardsInDecks: { [row: number]: number };
    tableCards: { [row: number]: Card[] };
}