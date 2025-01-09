"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [cards, setCards] = useState([]);
    const [symbols, setSymbols] = useState([]);

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

    useEffect(() => {
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

        const generateDobbleCards = (symbolsPerCard) => {
            try {
                const n = symbolsPerCard - 1; // n est basé sur le nombre de symboles par carte - 1
                const totalCards = n * n + n + 1; // Nombre total de cartes
                const randomSymbols = getRandomSymbol(totalCards);

                if (randomSymbols.length < totalCards) {
                    throw new Error(
                        "Pas assez de symboles pour générer toutes les cartes."
                    );
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
        const dobbleCards = generateDobbleCards(3);
        setCards(dobbleCards);
    }, [symbols]);

    return (
        <div>
            <h1>Dobble Game</h1>
            <div>
                {cards &&
                    cards.map((card, index) => (
                        <div
                            key={index}
                            style={{
                                margin: "10px",
                                padding: "10px",
                                border: "1px solid black",
                            }}
                        >
                            Carte {index + 1}: {card}
                        </div>
                    ))}
            </div>
        </div>
    );
}
