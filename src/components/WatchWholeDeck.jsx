import PropTypes from 'prop-types';

export function WatchWholeDeck({ setStep, deck, customSelectedCards, setCustomSelectedCards, playCustomGame }) {
    const minimumCardsToPlay = 3;
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
        <div className="flex flex-wrap flex-row place-content-center place-items-center w-full">
            <div className="z-10 md:flex-nowrap flex-wrap rounded-b-3xl sticky navbar top-0 p-2 justify-evenly bg-base-100">
                <a onClick={() => { setStep('config') }} className="btn btn-ghost text-xl">Home 🏚️</a>
                <div>
                    <div className="m-2">
                        <p>Você selecionou {customSelectedCards.length} cartas</p>
                        {customSelectedCards.length - minimumCardsToPlay < 0 && <p className="text-orange-300">Selecione mais {minimumCardsToPlay - customSelectedCards.length} para jogar</p>}
                    </div>
                    <button onClick={() => { setCustomSelectedCards([]) }} className=" mx-2 btn btn-xs btn-ghost">🗑️</button>
                </div>
                <button disabled={customSelectedCards.length < minimumCardsToPlay} onClick={() => { playCustomGame() }} className="btn btn-success text-xl">Play Custom Game ▶️</button>
            </div>
            {deck.map((card, index) => {
                return (
                    <img
                        onClick={() => handleClick(card)}
                        key={index}
                        className={`m-1 cursor-pointer w-32 md:w-1/5 z-0 ${customSelectedCards.includes(card) ? 'rounded-2xl border-4 border-success bg-opacity-50 bg-success' : 'opacity-100'}`}
                        src={card}
                    />
                )
            })}
        </div>
    )
}

WatchWholeDeck.propTypes = {
    setStep: PropTypes.func,
    deck: PropTypes.array,
    customSelectedCards: PropTypes.array,
    setCustomSelectedCards: PropTypes.func,
    playCustomGame: PropTypes.func
}