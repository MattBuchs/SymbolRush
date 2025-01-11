// Mélange les cartes et les symboles
export const shuffle = (array) => {
    const newArray = [...array];
    newArray.forEach((card) => card.sort(() => Math.random() - 0.5));
    return newArray.sort(() => Math.random() - 0.5);
};

// Obtiens des symboles aléatoires sans répétition
export const getRandomSymbol = (number, symbols) => {
    const availableIndices = [...symbols.keys()];
    const symbolsArr = [];

    for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const chosenIndex = availableIndices.splice(randomIndex, 1)[0]; // Retire l'index choisi
        symbolsArr.push(symbols[chosenIndex]);
    }

    return symbolsArr;
};
