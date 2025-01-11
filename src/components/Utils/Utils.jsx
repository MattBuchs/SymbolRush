export default function Utils({ fictionalCard }) {
    return (
        <>
            {fictionalCard && (
                <div>
                    <div className="w-[300px] h-[300px] bg-slate-300 rounded-lg border border-black p-3 absolute top-[75%] left-1/2 -translate-y-1/2 -translate-x-1/2">
                        <div className="w-full h-full bg-[url('/img/symbolrush.png')] bg-cover"></div>
                    </div>

                    <div className="w-[300px] h-[300px] bg-slate-300 rounded-lg border border-black p-3 absolute top-[25%] left-1/2 -translate-y-1/2 -translate-x-1/2">
                        <div className="w-full h-full bg-[url('/img/symbolrush.png')] bg-cover"></div>
                    </div>
                </div>
            )}
        </>
    );
}
