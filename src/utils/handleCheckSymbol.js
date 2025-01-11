export const handleCheckSymbol = (
    e,
    cards,
    cardsIndex,
    counter,
    setCounter,
    setFictionalCard,
    setAnimatedCard,
    setAnimatedCard2,
    setCardsDisplayed,
    setCardsIndex
) => {
    const symbol = e.target.textContent;
    const isGoodSymbol = cards[cardsIndex - 3].includes(symbol);

    if (counter < 3) {
        setFictionalCard(false);
    }

    if (isGoodSymbol) {
        setAnimatedCard(1); // Déclenche l'animation pour la carte à index 1
        setAnimatedCard2(true); // Déclenche l'animation pour la carte à index 2
        setCounter(counter - 1);

        setTimeout(() => {
            setCardsDisplayed((prevCardsDisplayed) => {
                const newCardsDisplayed = [...prevCardsDisplayed];

                if (cards[cardsIndex]) {
                    newCardsDisplayed.push(cards[cardsIndex]);
                }
                newCardsDisplayed.shift();

                return newCardsDisplayed;
            });

            setCardsIndex(cardsIndex + 1);
            setAnimatedCard(null); // Réinitialise après l'animation
            setAnimatedCard2(false); // Réinitialise après l'animation
        }, 500); // Temps de l'animation (en ms)
    }
};
