import { useState } from "react";

export default function Settings({ settings, setSettings }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value > settings[name].max || value < settings[name].min) return;

        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: { ...prevSettings[name], value: parseInt(value) },
        }));
    };

    return (
        <>
            {isSettingsOpen && (
                <section className="absolute top-0 bottom-0 right-0 left-0 overflow-hidden">
                    <div
                        className={`absolute z-50 bg-slate-100 w-full bottom-0 py-3 border-t border-black translate-y-full ${
                            isSettingsOpen ? "animate-translateUp" : ""
                        }`}
                    >
                        <h2 className="text-center text-2xl font-semibold underline underline-offset-4">
                            Paramètres
                        </h2>

                        <div className="px-10 mt-5 pb-2 text-lg">
                            <div>
                                <label
                                    htmlFor="range-symbol"
                                    className="block italic"
                                >
                                    Nombre de symbol sur la carte
                                </label>
                                <input
                                    type="range"
                                    id="range-symbol"
                                    name="nbSymbolPerCard"
                                    min={settings.nbSymbolPerCard.min}
                                    max={settings.nbSymbolPerCard.max}
                                    value={settings.nbSymbolPerCard.value}
                                    step={1}
                                    onChange={handleChange}
                                />
                                <span>{settings.nbSymbolPerCard.value}</span>
                            </div>

                            <div>
                                <label htmlFor="range-card" className="block">
                                    Nombre de carte
                                </label>
                                <input
                                    type="range"
                                    id="range-card"
                                    name="nbCards"
                                    min={settings.nbCards.min}
                                    max={settings.nbCards.max}
                                    value={settings.nbCards.value}
                                    step={1}
                                    onChange={handleChange}
                                />
                                <span>{settings.nbCards.value}</span>
                            </div>

                            <div>
                                <label htmlFor="timer-type" className="block">
                                    Type de chronomètre
                                </label>
                                <select
                                    id="timer-type"
                                    name="timerType"
                                    value={settings.timerType}
                                    onChange={(e) => {
                                        setSettings((prevSettings) => ({
                                            ...prevSettings,
                                            timerType: e.target.value,
                                        }));
                                    }}
                                >
                                    <option value="">Aucun</option>
                                    <option value="stopwatch">
                                        Chronomètre
                                    </option>
                                    <option value="timer">Minuteur</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="range-time" className="block">
                                    Temps
                                </label>
                                <input
                                    type="range"
                                    id="range-time"
                                    name="expiryTimestamp"
                                    min={settings.expiryTimestamp.min}
                                    max={settings.expiryTimestamp.max}
                                    value={settings.expiryTimestamp.value}
                                    step={1}
                                    onChange={handleChange}
                                />
                                <span>{settings.expiryTimestamp.value}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsSettingsOpen(false);
                            }}
                            className="bg-red-700 hover:bg-red-800 px-2 py-1 text-2xl rounded-lg absolute top-2 right-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 384 512"
                                className="h-6 w-6"
                                fill="#fff"
                            >
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </button>
                    </div>
                    <div
                        onClick={() => {
                            setIsSettingsOpen(false);
                        }}
                        className="bg-black/80 absolute top-0 right-0 left-0 bottom-0 z-40"
                    ></div>
                </section>
            )}
            <button
                onClick={() => {
                    setIsSettingsOpen(true);
                }}
                className="absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 px-3 py-2 text-2xl rounded-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-6 w-6"
                    fill="#fff"
                >
                    <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
                </svg>
            </button>
        </>
    );
}
