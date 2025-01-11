import { getRandomSymbol } from "./randomFunctions";

export const generateSymbolCards = (
    symbolsPerCard,
    symbols,
    setCounter,
    setError
) => {
    const n = symbolsPerCard - 1;
    const totalCards = n * n + n + 1;
    const randomSymbols = getRandomSymbol(totalCards, symbols);
    setCounter(totalCards - 1);

    if (symbols.length < totalCards) {
        setError(true);
        return false;
    }

    const cards = [];

    // Étape 1 : Créer la première série de cartes
    for (let i = 0; i < n; i++) {
        const card = [randomSymbols[0]]; // Le premier symbole est commun à toutes les cartes de la série
        for (let j = 0; j < n; j++) {
            card.push(randomSymbols[1 + i * n + j]); // Ajout des autres symboles
        }
        cards.push(card);
    }

    // Étape 2 : Créer les séries suivantes
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const card = [randomSymbols[1 + i]]; // Symbole principal de la carte
            for (let k = 0; k < n; k++) {
                const index = n + 1 + k * n + ((j + k * i) % n);
                card.push(randomSymbols[index]); // Ajout des permutations
            }
            cards.push(card);
        }
    }

    // Étape 3 : Ajouter la dernière carte
    const lastCard = [randomSymbols[0]];
    for (let i = 1; i < n + 1; i++) {
        lastCard.push(randomSymbols[n * n + i]); // Utiliser les bons indices pour éviter les doublons
    }
    cards.push(lastCard);

    return cards;
};
