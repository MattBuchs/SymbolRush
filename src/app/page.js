"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import Game from "@/components/Game/Game";
import Utils from "@/components/Utils/Utils";

export default function Home() {
    const [fictionalCard, setFictionalCard] = useState(true);

    return (
        <>
            <Header />
            <main>
                <Game setFictionalCard={setFictionalCard} />
                <Utils fictionalCard={fictionalCard} />
            </main>
        </>
    );
}
