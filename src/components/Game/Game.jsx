"use client";

import { useCallback, useEffect, useState } from "react";

export default function Game() {
    const [cards, setCards] = useState([]);
    const [cardsDisplayed, setCardsDisplayed] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [counter, setCounter] = useState(null);
    const [error, setError] = useState(null);
    const [cardsIndex, setCardsIndex] = useState(3);
    const [nbSymbolPerCard, setNbSymbolPerCard] = useState({
        nb: 8,
        class: "text-[3rem]",
    });
    const [animatedCard, setAnimatedCard] = useState(null); // Carte animée (index)
    const [animatedCard2, setAnimatedCard2] = useState(false);
    const [fictionalCard, setFictionalCard] = useState(true);

    // Mélange les cartes et les symboles
    const shuffle = (array) => {
        const newArray = [...array];
        newArray.forEach((card) => card.sort(() => Math.random() - 0.5));
        return newArray.sort(() => Math.random() - 0.5);
    };

    // Obtiens des symboles aléatoires sans répétition
    const getRandomSymbol = (number) => {
        const availableIndices = [...symbols.keys()];
        const symbolsArr = [];

        for (let i = 0; i < number; i++) {
            const randomIndex = Math.floor(
                Math.random() * availableIndices.length
            );
            const chosenIndex = availableIndices.splice(randomIndex, 1)[0]; // Retire l'index choisi
            symbolsArr.push(symbols[chosenIndex]);
        }

        return symbolsArr;
    };

    const handleCheckSymbol = useCallback(
        (e) => {
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

                        if (cards[cardsIndex])
                            newCardsDisplayed.push(cards[cardsIndex]);
                        newCardsDisplayed.shift();

                        return newCardsDisplayed;
                    });
                    setCardsIndex(cardsIndex + 1);
                    setAnimatedCard(null); // Réinitialise après l'animation
                    setAnimatedCard2(false); // Réinitialise après l'animation
                }, 500); // Temps de l'animation (en ms)
            }

            // if (cardsDisplayed.length < 3) {
            //     setFictionalCard(false);
            // }
        },
        [cards, cardsIndex]
    );

    useEffect(() => {
        // Récupére les symboles depuis un fichier JSON
        const getSymbols = async () => {
            const apiUrl = "http://localhost:3000/emojis.json";

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                setSymbols(data.emojis);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des émojis :",
                    error
                );
            }
        };
        getSymbols();
    }, []);

    useEffect(() => {
        if (symbols.length === 0) return;

        const generateSymbolCards = (symbolsPerCard) => {
            try {
                const n = symbolsPerCard - 1;
                const totalCards = n * n + n + 1;
                const randomSymbols = getRandomSymbol(totalCards);
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
            } catch (error) {
                console.error(error);
            }
        };

        // Générer les cartes avec 3 symboles par carte
        const cardsGenerated = generateSymbolCards(nbSymbolPerCard.nb);

        if (!cardsGenerated) return;

        const shuffleCards = shuffle(cardsGenerated);
        setCards(shuffleCards);
        setCardsDisplayed([shuffleCards[0], shuffleCards[1], shuffleCards[2]]);
    }, [symbols]);

    return (
        <main className="h-screen p-4">
            {!error && cards && (
                <ul className="flex flex-wrap justify-center gap-4">
                    {cardsDisplayed.map((card, index) => (
                        <li
                            key={index}
                            className={`absolute left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 perspective-[2000px] perspective-origin-top ${
                                index <= 1 ? "z-20" : "z-10"
                            } ${
                                animatedCard === index ? "animate-move-up" : ""
                            }`}
                            style={{
                                top: `${index <= 0 ? "30%" : "75%"}`,
                            }}
                        >
                            <div
                                className={`relative w-full h-full shadow-md transform-style-3d transition-transform duration-500 ${
                                    animatedCard2
                                        ? index > 1
                                            ? "animate-rotateCard"
                                            : ""
                                        : ""
                                }`}
                                style={{
                                    transform: `translate(${
                                        index <= 1 ? 0 : 3
                                    }px)`,
                                }}
                            >
                                <div className="bg-slate-50 w-full h-full flex justify-center items-center flex-wrap gap-1 p-4 rounded-lg border border-black absolute backface-hidden">
                                    {card.map((symbol, indexSymbol) => (
                                        <button
                                            key={`${index}-${indexSymbol}`}
                                            onClick={(e) =>
                                                handleCheckSymbol(e)
                                            }
                                            disabled={index <= 0}
                                            className={`${
                                                nbSymbolPerCard.class
                                            } transition-transform${
                                                index > 0
                                                    ? " hover:scale-[0.93] hover:opacity-85"
                                                    : ""
                                            }`}
                                        >
                                            {(index <= 1 && symbol) ||
                                                (animatedCard2 && symbol)}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-full h-full absolute backface-hidden rotate-y-180 bg-slate-300 rounded-lg border border-black p-3">
                                    <div className="w-full h-full bg-[url('/img/symbolrush.png')] bg-cover"></div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {fictionalCard && (
                        <li className="w-[300px] h-[300px] bg-slate-300 rounded-lg border border-black p-3 absolute top-[75%] left-1/2 -translate-y-1/2 -translate-x-1/2">
                            <div className="w-full h-full bg-[url('/img/symbolrush.png')] bg-cover"></div>
                        </li>
                    )}
                </ul>
            )}
        </main>
    );
}
