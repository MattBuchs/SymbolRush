"use client";

import { useCallback, useEffect, useState } from "react";
import Timer from "../Timer/Timer";
import { shuffle } from "@/utils/randomFunctions";
import { generateSymbolCards } from "@/utils/generateSymbol";
import { handleCheckSymbol as handleCheckSymbolUtil } from "@/utils/handleCheckSymbol";
import Settings from "../Settings/Settings";

export default function Game({ setFictionalCard }) {
    const [cards, setCards] = useState([]);
    const [cardsDisplayed, setCardsDisplayed] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [counter, setCounter] = useState(null);
    const [error, setError] = useState(null);
    const [cardsIndex, setCardsIndex] = useState(3);
    const [animatedCard, setAnimatedCard] = useState(null); // Carte animée (index)
    const [animatedCard2, setAnimatedCard2] = useState(false);
    const [animatedStart, setAnimatedStart] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [settings, setSettings] = useState({
        expiryTimestamp: { value: 1, min: 1, max: 60 },
        timerType: "timer",
        nbCards: { value: 57, min: 5, max: 57 },
        nbSymbolPerCard: { value: 8, min: 3, max: 20, class: "text-[3rem]" },
    });

    const handleCheckSymbol = useCallback(
        (e) => {
            handleCheckSymbolUtil(
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
            );
        },
        [
            cards,
            cardsIndex,
            counter,
            setCounter,
            setFictionalCard,
            setAnimatedCard,
            setAnimatedCard2,
            setCardsDisplayed,
            setCardsIndex,
        ]
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
        if (gameStarted) {
            setAnimatedStart(true);

            setTimeout(() => {
                setAnimatedStart(false);
            }, 600);
            // Générer les cartes
            const cardsGenerated = generateSymbolCards(
                settings.nbSymbolPerCard.value,
                symbols,
                setCounter,
                setError
            );

            if (!cardsGenerated) return;

            const shuffleCards = shuffle(cardsGenerated);
            setCards(shuffleCards);
            setCardsDisplayed([
                shuffleCards[0],
                shuffleCards[1],
                shuffleCards[2],
            ]);
        }
    }, [gameStarted]);

    return (
        <section className="h-screen p-4">
            {!error && cards && cards.length > 0 && (
                <>
                    <ul className="flex flex-wrap justify-center gap-4">
                        {cardsDisplayed.map((card, index) => (
                            <li
                                key={index}
                                className={`absolute left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 perspective-[2000px] perspective-origin-top ${
                                    index <= 1 ? "z-20" : "z-10"
                                } ${
                                    animatedCard === index
                                        ? "animate-move-up"
                                        : ""
                                }`}
                                style={{
                                    top: `${index <= 0 ? "25%" : "75%"}`,
                                }}
                            >
                                <div
                                    className={`relative w-full h-full shadow-md transform-style-3d transition-transform duration-500 ${
                                        animatedCard2
                                            ? index > 1
                                                ? "animate-rotateCard"
                                                : ""
                                            : ""
                                    } ${
                                        animatedStart
                                            ? "animate-rotateCard"
                                            : ""
                                    }`}
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
                                                    settings.nbSymbolPerCard
                                                        .class
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
                    </ul>
                </>
            )}
            {symbols && symbols.length > 0 && settings.expiryTimestamp && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Timer
                        expiryTimestamp={settings.expiryTimestamp.value}
                        isGameStarted={gameStarted}
                        setGameStarted={setGameStarted}
                        timerType={settings.timerType}
                    />
                </div>
            )}
            <Settings settings={settings} setSettings={setSettings} />
        </section>
    );
}
