import { useState } from "react";
import { coupleDeck } from './utils/importCoupleDeck';
import { iveNeverDeck } from './utils/importIveNeverDeck.js';
import { WatchWholeDeck } from './components/WatchWholeDeck';
import { useEffect } from "react";

const steps = {
  CONFIG: 'config',
  PLAYING: 'playing',
  WATCH: 'watch'
}

function App() {
  const [numberOfCardsToPlay, setNumberOfCardsToPlay] = useState(10);
  const [playingDeck, setPlayingDeck] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(coupleDeck);
  const [cardIndex, setCardIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [customSelectedCards, setCustomSelectedCards] = useState([]);
  // const [timer, setTimer] = useState("15");

  const [step, setStep] = useState('config');

  useEffect(() => {
    const keyDownHandler = ({ key }) => {
      if ((key === 'Enter') && step === steps.PLAYING) {
        return setFlip(!flip);
      }
      if ((key === 'ArrowRight') && step === steps.PLAYING) {
        return goNextCard();
      }
      if ((key === 'ArrowLeft') && step === steps.PLAYING) {
        return goPreviousCard();
      }
    }
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  })

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

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex], deck[currentIndex]];
    }
    newDeck = deck.slice(0, deckCardAmount);
    setPlayingDeck([...newDeck]);
  };

  const deckConfigComponent = () => {
    return (
      <div className="DECK_CONFIG flex flex-col place-content-center place-items-center">
        <div className="flex flex-row place-items-center place-content-center">
          <img
            onClick={() => { setCurrentDeck(coupleDeck) }}
            src={coupleDeck[0]}
            className={`${currentDeck === coupleDeck ? 'w-1/3' : 'w-1/4 opacity-65'} cursor-pointer mx-2 md:w-1/5 my-4`} />
          <img
            onClick={() => { setCurrentDeck(iveNeverDeck) }}
            src={iveNeverDeck[0]}
            className={`${currentDeck === iveNeverDeck ? 'w-1/3' : 'w-1/4 opacity-65'} cursor-pointer mx-2 md:w-1/5 my-4`} />
        </div>
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
        <div className="flex w-10/12 flex-col place-items-center place-content-center my-5">
          <button disabled={currentDeck.length === 0} onClick={() => startGame()} className="btn-lg my-2 w-full btn btn-success">Iniciar▶️</button>
          <button disabled={currentDeck.length === 0} onClick={() => watchDeck()} className="btn-lg my-2 w-full btn btn-primary">Monte seu Jogo ♣️</button>
          <div className="m-2 flex flex-row place-content-center place-items-center w-full">
            <button onClick={() => document.getElementById('faq_modal')?.showModal()} className="btn-md mx-2 btn btn-info">Dúvidas 🗯️</button>
            <button disabled={currentDeck.length === 0} onClick={() => resetAndGoHome()} className="btn-md mx-2 btn btn-warning">Resetar 🔃</button>
          </div>
        </div>
      </div>
    )
  }
  const playingComponent = () => {
    return (
      <div className="flex w-full h-auto justify-start self-start items-center flex-col">
        <div className="z-10 rounded-b-3xl sticky flex-wrap md:flex-nowrap navbar top-0 justify-evenly bg-base-100">
          <a onClick={() => { setStep(steps.CONFIG); resetAndGoHome() }} className="btn btn-ghost text-xl">Home 🏚️</a>
          {/* <div className="flex flex-row">
            <a onClick={() => { watchDeck() }} className="mr-4 btn btn-info text-xl">Start Timer ⏳</a>
            <input className="input input-bordered input-info w-20" value={timer} onChange={(event) => { setTimer(event.target.value) }} placeholder="15" type="number" />
          </div> */}
        </div>
        <div className="flex flex-row place-content-center place-items-center">
          Cartas restantes: {playingDeck.length - cardIndex - 1}
          <div className={`p-1 m-1 border-4 rounded-3xl font-bold ${cardIndex % 2 === 0 ? 'border-primary bg-primary' : 'bg-warning border-warning text-black'}`}>
            <p>Turno {cardIndex % 2 === 0 ? 'roxo' : 'amarelo'}</p>
          </div>
        </div>

        <div className="w-8/12 h-auto flex place-items-center place-content-center">
          {
            flip ?
              <img onClick={() => { setFlip(false) }} className="cursor-pointer md:h-96 h-1/2" src={playingDeck[cardIndex]} /> :
              <img onClick={() => { setFlip(true) }} className="cursor-pointer md:h-96 h-1/2" src={currentDeck[0]} />
          }
        </div>
        <div className="btm-nav">
          <button onClick={() => goPreviousCard()} className="bg-warning text-black text-2xl font-bold">
            {"<"}
            <span className="btm-nav-label text-lg font-bold">Anterior</span>
          </button>
          <button onClick={() => setFlip(!flip)} className="bg-gray-600 text-black text-2xl font-bold">
            🔃
            <span className="btm-nav-label text-lg">Virar Carta</span>
          </button>
          <button onClick={() => goNextCard()} className="bg-green-500 text-black text-2xl font-bold">
            {">"}
            <span className="btm-nav-label text-lg font-bold">Próxima</span>
          </button>
        </div>
        {/* <div className="flex justify-evenly md:w-1/6 my-4">
          <button onClick={() => goPreviousCard()} className="btn mx-1 md:btn-lg btn-sm btn-danger">{"<"} Anterior</button>
          <button onClick={() => goNextCard()} className="btn mx-1 md:btn-lg btn-sm btn-success">Próxima {">"}</button>
        </div> */}
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
    <div className='overflow-x-hidden h-screen w-full flex flex-row flex-wrap justify-center align-middle items-center'>
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
