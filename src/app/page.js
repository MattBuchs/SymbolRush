"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [cards, setCards] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [error, setError] = useState(null);
    const [cardsFound, setCardsFound] = useState(0);

    // Mélange les cartes et les symboles
    const shuffle = (array) => {
        const newArray = array.sort(() => Math.random() - 0.5);
        newArray.map((card) => {
            card.sort(() => Math.random() - 0.5);
        });

        return newArray;
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

    const checkIsGoodSymbol = (e, index, indexSymbol) => {
        const symbol = e.target.textContent;
        const isGoodSymbol = cards[index - 1].includes(symbol);

        if (isGoodSymbol) {
            setCardsFound(index);
        }
    };

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
                const n = symbolsPerCard - 1; // n est basé sur le nombre de symboles par carte - 1
                const totalCards = n * n + n + 1; // Nombre total de cartes
                const randomSymbols = getRandomSymbol(totalCards);

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
        const cardsGenerated = generateSymbolCards(8);

        if (!cardsGenerated) return;

        const shuffleCards = shuffle(cardsGenerated);
        setCards(shuffleCards);
    }, [symbols]);

    return (
        <div className="bg-slate-600 min-h-screen p-4">
            <h1 className="text-4xl text-slate-50 font-semibold text-center mt-3 mb-12">
                SymbolRush
            </h1>
            {!error && cards && (
                <ul className="flex flex-wrap justify-center gap-4">
                    {cards.map((card, index) => (
                        <li
                            key={index}
                            className="w-[300px] h-[300px] flex justify-center items-center flex-wrap gap-1 p-4 rounded-lg bg-slate-50 border border-black shadow-md absolute"
                            style={{
                                top: `${index <= cardsFound ? "30%" : "75%"}`,
                                left: `50%`,
                                transform: `translate(-50%, -50%)`,
                                zIndex: `${
                                    index > cardsFound
                                        ? cards.length - index
                                        : index
                                }`,
                            }}
                        >
                            {card.map((symbol, indexSymbol) => (
                                <button
                                    key={`${index}-${indexSymbol}`}
                                    onClick={(e) => {
                                        checkIsGoodSymbol(
                                            e,
                                            index,
                                            indexSymbol
                                        );
                                    }}
                                    disabled={index <= cardsFound}
                                    className={`text-[3.5rem] transition-transform${
                                        index > cardsFound
                                            ? " hover:scale-[0.93] hover:opacity-85"
                                            : ""
                                    }`}
                                >
                                    {symbol}
                                </button>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
