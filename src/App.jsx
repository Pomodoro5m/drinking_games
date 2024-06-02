import { useState } from "react";
import { coupleDeck } from './utils/importCoupleDeck';
import { iveNeverDeck } from './utils/importIveNeverDeck.js';
import { WatchWholeDeck } from './components/WatchWholeDeck';
import { useEffect } from "react";


const DeckType = {
  COUPLE: 1,
  IVENEVER: 2
}

const steps = {
  CONFIG: 'config',
  PLAYING: 'playing',
  WATCH: 'watch'

}

function App() {
  const [numberOfCardsToPlay, setNumberOfCardsToPlay] = useState(10);
  const [playingDeck, setPlayingDeck] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [customSelectedCards, setCustomSelectedCards] = useState([]);
  // const [timer, setTimer] = useState("15");

  const [step, setStep] = useState('config');

  useEffect(() => {
    const keyDownHandler = ({ key }) => {
      if (key === 'Enter' && step === steps.PLAYING) {
        return setFlip(!flip);
      }
      if (key === 'ArrowRight' && step === steps.PLAYING) {
        return goNextCard();
      }
      if (key === 'ArrowLeft' && step === steps.PLAYING) {
        return goPreviousCard();
      }
    }
    window.addEventListener("keypress", keyDownHandler);

    return () => {
      window.removeEventListener("keypress", keyDownHandler);
    };
  }, [])

  const resetAndGoHome = (resetDeck = false) => {
    resetDeck && setCurrentDeck([]);
    setNumberOfCardsToPlay(10);
    setPlayingDeck([]);
    setCardIndex(0);
    setFlip(false);
    setCustomSelectedCards([]);
    // setTimer("15");
  }

  const goNextCard = () => {
    setFlip(false);
    if (cardIndex < playingDeck.length - 1) {
      setCardIndex(cardIndex + 1);
    }
  }

  const goPreviousCard = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  }

  const playCustomGame = () => {
    setCardIndex(0);
    shuffleDeck(customSelectedCards, customSelectedCards.length);
    setStep(steps.PLAYING);
  }

  const startGame = () => {
    setCardIndex(0);
    shuffleDeck(currentDeck);
    setStep(steps.PLAYING);
  };

  const watchDeck = () => {
    setStep(steps.WATCH);
    setPlayingDeck([...currentDeck]);
  };

  const shuffleDeck = (deckToShuffle, deckCardAmount = numberOfCardsToPlay) => {
    let deck = [...deckToShuffle];
    deck.includes(currentDeck[0]) && deck.splice(0, 1);
    let newDeck = [];
    let currentIndex = deck.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex], deck[currentIndex]];
    }
    newDeck = deck.slice(0, deckCardAmount);
    setPlayingDeck([...newDeck]);
  };

  const deckConfigComponent = () => {
    return (
      <div className="DECK_CONFIG flex flex-col place-content-center place-items-center">
        <img src={currentDeck[0]} className="w-1/2 md:w-1/5 my-4" />
        <select
          onChange={(event) => {
            Number(event?.target?.value ?? '1') === DeckType.COUPLE ? setCurrentDeck(coupleDeck) : setCurrentDeck(iveNeverDeck)
          }}
          defaultValue={currentDeck.length === 0 ? 0 : currentDeck === coupleDeck ? DeckType.COUPLE : DeckType.IVENEVER}
          className="select select-bordered w-full max-w-xs">
          <option value={0} disabled>Select Deck</option>
          <option value={DeckType.COUPLE}>Esquenta Casal</option>
          <option value={DeckType.IVENEVER} >Eu Nunca</option>
        </select>
        <p className="mt-5 mb-2">Escolha o numero de cartas</p>
        <div className="flex flex-row mb-5">
          <input
            className="range range-accent mx-4"
            type="range"
            min={0}
            max={currentDeck.length}
            value={numberOfCardsToPlay}
            onChange={(e) => setNumberOfCardsToPlay(Number(e.target.value))}
          />
          <span className="text-lg text-center">{numberOfCardsToPlay}</span>
        </div>
        <div className="flex flex-col place-items-center place-content-center my-5">
          <div className="m-2 flex flex-row place-content-center place-items-center">
            <button disabled={currentDeck.length === 0} onClick={() => watchDeck()} className="btn-lg max-w-md btn mx-3 btn-primary">Custom Game ♣️</button>
            <button disabled={currentDeck.length === 0} onClick={() => startGame()} className="btn-lg max-w-md btn mx-3 btn-success">Play ▶️</button>
          </div>
          <div className="m-2 flex flex-row place-content-center place-items-center">
            <button onClick={() => document.getElementById('faq_modal')?.showModal()} className="btn-lg max-w-md btn mx-3 btn-info">FAQ 🗯️</button>
            <button disabled={currentDeck.length === 0} onClick={() => resetAndGoHome()} className="btn-lg max-w-md btn mx-3 btn-warning">Reset Default 🔃</button>
          </div>
        </div>
      </div>
    )
  }

  const playingComponent = () => {
    return (
      <div className="flex place-content-center place-items-center w-full h-auto flex-wrap flex-col">
        <div className="z-10 rounded-3xl sticky flex-wrap md:flex-nowrap navbar top-0 p-4 justify-evenly bg-base-100">
          <a onClick={() => { setStep(steps.CONFIG); resetAndGoHome() }} className="btn btn-ghost text-xl">Home 🏚️</a>
          {/* <div className="flex flex-row">
            <a onClick={() => { watchDeck() }} className="mr-4 btn btn-info text-xl">Start Timer ⏳</a>
            <input className="input input-bordered input-info w-20" value={timer} onChange={(event) => { setTimer(event.target.value) }} placeholder="15" type="number" />
          </div> */}
        </div>
        <div className="flex flex-row place-content-center place-items-center">
          Cards remaining: {playingDeck.length - cardIndex - 1}
          <div className={`p-2 m-2 border-4 rounded-3xl font-bold ${cardIndex % 2 === 0 ? 'border-primary bg-primary' : 'bg-warning border-warning text-black'}`}>
            <p>Turno {cardIndex % 2 === 0 ? 'roxo' : 'amarelo'}</p>
          </div>
        </div>

        <div className="w-full h-auto flex place-items-center place-content-center">
          {
            flip ?
              <img onClick={() => { setFlip(false) }} className="cursor-pointer md:h-96 h-1/2" src={playingDeck[cardIndex]} /> :
              <img onClick={() => { setFlip(true) }} className="cursor-pointer md:h-96 h-1/2" src={currentDeck[0]} />
          }
        </div>
        <div className="flex justify-evenly md:w-1/6 my-4">
          <button onClick={() => goPreviousCard()} className="btn mx-1 md:btn-lg btn-sm btn-danger">{"<"} Previous</button>
          <button onClick={() => goNextCard()} className="btn mx-1 md:btn-lg btn-sm btn-success">Next {">"}</button>
        </div>
      </div>
    );
  }

  const FAQModal = () => {
    return (
      <dialog id="faq_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <p className="py-4">Custom Game ♣️ - selecione as cartas que deseja jogar do deck selecionado!</p>
          <p className="py-4">Reset Default 🔃 - Volta as configurações ao normal, mantendo o deck selecionado!</p>
          <p className="py-4">Por que os botões estão desabilitado? - Você deve selecionar o deck e no mínimo 1 carta para poder habilitar o jogo!</p>
          <p className="py-4">Dúvidas ou sugestões, mandar no instagran <a href="https://www.instagram.com/matheusjimenez/" target="_blank">@Matheusjimenez</a></p>
          <p className="py-4">Atalhos: Enter para virar a carta / setas {"<-- e -->"} para navegar</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    )
  }

  return (
    <div className='overflow-x-hidden p-10 h-screen w-full flex flex-row flex-wrap justify-center align-middle items-center'>
      {
        step === steps.CONFIG && deckConfigComponent()
      }
      {
        step === steps.PLAYING && playingComponent()
      }
      {
        step === steps.WATCH && <WatchWholeDeck
          deck={currentDeck}
          setStep={setStep}
          customSelectedCards={customSelectedCards}
          setCustomSelectedCards={setCustomSelectedCards}
          playCustomGame={playCustomGame}
        />
      }
      {FAQModal()}
    </div >
  )
}

export default App
