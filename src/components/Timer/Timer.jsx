import { useState, useEffect } from "react";
import { useStopwatch, useTimer } from "react-timer-hook";

export default function Timer({
    settings,
    isGameStarted,
    setGameStarted,
    setSettingsDisplayed,
}) {
    const [countdown, setCountdown] = useState(3); // Compte à rebours de 3 secondes
    const [isCountingDown, setIsCountingDown] = useState(false);

    const {
        seconds: secondsTimer,
        minutes: minutesTimer,
        hours: hoursTimer,
        start: startTimer,
        restart: restartTimer,
    } = useTimer({
        expiryTimestamp: settings.expiryTimestamp.value * 60,
        onExpire: () => setGameStarted(false),
    });
    const {
        seconds: secondsStopwatch,
        minutes: minutesStopwatch,
        hours: hoursStopwatch,
        reset: resetStopwatch,
        start: startStopwatch,
    } = useStopwatch();

    useEffect(() => {
        if (isCountingDown && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setIsCountingDown(false);
            setGameStarted(true);

            if (settings.timerType === "timer") {
                const time = new Date();
                time.setSeconds(
                    time.getSeconds() + settings.expiryTimestamp.value * 60
                );
                restartTimer(time);
            }
            if (settings.timerType === "stopwatch") {
                startStopwatch();
            }
        }
    }, [countdown, isCountingDown]);

    const startCountdown = () => {
        setIsCountingDown(true);
        setCountdown(3); // Réinitialise le compte à rebours à 3 secondes
        setSettingsDisplayed(false);

        localStorage.setItem("settings", JSON.stringify(settings));
    };

    return (
        <>
            {!isGameStarted && !isCountingDown && (
                <button
                    onClick={startCountdown}
                    className="bg-blue-600 text-white px-6 py-2 text-2xl rounded border border-white/50 shadow hover:bg-blue-700 transition-colors"
                >
                    Commencer
                </button>
            )}
            {isCountingDown && (
                <div className="text-7xl mb-4 flex justify-center gap-2">
                    <span>{countdown}</span>
                </div>
            )}
            {isGameStarted && settings.timerType !== "none" && (
                <div className="text-7xl mb-4 flex justify-center gap-2">
                    {settings.timerType === "timer" && (
                        <>
                            {hoursTimer > 0 && (
                                <>
                                    <span>
                                        {hoursTimer < 10 ? "0" : ""}
                                        {hoursTimer}
                                    </span>
                                    :
                                </>
                            )}
                            <span>
                                {minutesTimer < 10 ? "0" : ""}
                                {minutesTimer}
                            </span>
                            :
                            <span>
                                {secondsTimer < 10 ? "0" : ""}
                                {secondsTimer}
                            </span>
                        </>
                    )}
                    {settings.timerType === "stopwatch" && (
                        <>
                            {hoursStopwatch > 0 && (
                                <>
                                    <span>
                                        {hoursStopwatch < 10 ? "0" : ""}
                                        {hoursStopwatch}
                                    </span>
                                    :
                                </>
                            )}
                            <span>
                                {minutesStopwatch < 10 ? "0" : ""}
                                {minutesStopwatch}
                            </span>
                            :
                            <span>
                                {secondsStopwatch < 10 ? "0" : ""}
                                {secondsStopwatch}
                            </span>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
