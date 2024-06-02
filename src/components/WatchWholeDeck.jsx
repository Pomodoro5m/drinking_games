export function WatchWholeDeck({ setStep, deck, customSelectedCards, setCustomSelectedCards, playCustomGame }) {

    const handleClick = (card) => {
        if (customSelectedCards.includes(card)) {
            setCustomSelectedCards(customSelectedCards.filter(selectedCard => selectedCard !== card));
        } else {
            setCustomSelectedCards([...customSelectedCards, card]);
        }
    }

    if (!deck) {
        return (
            <div>
                <h1>Watch Whole Deck</h1>
                <p>Deck is empty</p>
            </div>
        )
    }
    return (
        <div className="flex flex-wrap flex-row place-content-center place-items-center">
            <div className="z-10 rounded-3xl sticky navbar top-0 p-4 justify-evenly bg-base-100">
                <a onClick={() => { setStep('config') }} className="btn btn-ghost text-xl">Home 🏚️</a>
                <button disabled={customSelectedCards.length === 0} onClick={() => { playCustomGame() }} className="btn btn-success text-xl">Play Custom Game ▶️</button>
            </div>
            {deck.map((card, index) => {
                return (
                    <img
                        onClick={() => handleClick(card)}
                        key={index}
                        className={`m-1 cursor-pointer w-1/5 z-0 ${customSelectedCards.includes(card) ? 'opacity-50 rounded-2xl border-4 border-success' : 'opacity-100'}`}
                        src={card}
                    />
                )
            })}
        </div>
    )
}
