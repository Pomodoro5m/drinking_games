import { useState, useRef, useEffect } from "react";
import { coupleDeck } from "./utils/importCoupleDeck";
import { iveNeverDeck } from "./utils/importIveNeverDeck.js";
import { truthOrChallengeDeck } from "./utils/importTruthOrChallenge.js";
import { findOutDeck } from "./utils/importFindOut.js";
import { WatchWholeDeck } from "./components/WatchWholeDeck";
import { SweetAlert } from "./components/SweetAlert.jsx";
import {
  Cog8ToothIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import CharSelect from "./components/CharSelect";

const steps = {
  CONFIG: "config",
  PLAYING: "playing",
  WATCH: "watch",
};

const MAXIMUM_PLAYER_AMOUNT = 6;
const MINIMUM_PLAYERS_AMOUNT = 2;

function App() {
  const [numberOfCardsToPlay, setNumberOfCardsToPlay] = useState(10);
  const [playingDeck, setPlayingDeck] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(coupleDeck);
  const [cardIndex, setCardIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [customSelectedCards, setCustomSelectedCards] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showCharSelect, setCharSelect] = useState(false);
  const [step, setStep] = useState("config");
  const [players, setPlayers] = useState(["Roxo", "Amarelo"]);
  const [playersArrayOrder, setPlayersArrayOrder] = useState([]);
  const [currentItem, setCurrentItem] = useState(0);

  const [index, setIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState(null)
  const timeoutRef = useRef(null);
  const cardBack = useRef(null);
  const delay = 15000;

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX
    setTouchPosition(touchDown)
  }

  const handleTouchMove = (e) => {
    const touchDown = touchPosition

    if (touchDown === null) {
      return
    }

    const currentTouch = e.touches[0].clientX
    const diff = touchDown - currentTouch

    if (diff > 5) {
      goNextCard();
    }

    if (diff < -5) {
      goPreviousCard();
    }

    setTouchPosition(null)
  }

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        goNextCard(),
      delay
    );

    return () => { resetTimeout(); };
  }, [index]);

  const playerColor = [
    { background: "#8f34eb", textColor: null },
    { background: "#fad607", textColor: "text-black" },
    { background: "#42eff5", textColor: null },
    { background: "#f01f31", textColor: null },
    { background: "#d948ca", textColor: null },
    { background: "#1ac20e", textColor: null },
  ];

  useEffect(() => {
    let playersArray = new Array(currentDeck.length).fill("");
    let count = 0;
    playersArray.forEach((__, index) => {
      playersArray[index] = players[count];
      count++;
      if (players.length === count) count = 0;
    });
    setPlayersArrayOrder(playersArray);
  }, [currentDeck, players]);

  useEffect(() => {
    const keyDownHandler = ({ key }) => {
      if (key === "Enter" && step === steps.PLAYING) {
        return setFlip(!flip);
      }
      if ((key === "ArrowRight") & (step === steps.PLAYING)) {
        return goNextCard();
      }
      if (key === "ArrowLeft" && step === steps.PLAYING) {
        return goPreviousCard();
      }
    };


    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  const resetAndGoHome = (resetDeck = false) => {
    resetDeck && setCurrentDeck([]);
    setNumberOfCardsToPlay(10);
    setPlayingDeck([]);
    setCardIndex(0);
    setFlip(false);
    setCustomSelectedCards([]);
    // setTimer("15");
  };

  const goNextCard = () => {
    if (!flip) {
      setFlip(true);
      return;
    }
    setFlip(false);
    if (cardIndex < playingDeck.length - 1) {
      setCardIndex(cardIndex + 1);
    }
  };

  const goPreviousCard = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const playCustomGame = () => {
    setCardIndex(0);
    shuffleDeck(customSelectedCards, customSelectedCards.length);
    setStep(steps.PLAYING);
  };

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
        deck[randomIndex],
        deck[currentIndex],
      ];
    }
    newDeck = deck.slice(0, deckCardAmount);
    setPlayingDeck([...newDeck]);
  };

  const deckConfigComponent = () => {
    return (
      <div className="flex flex-col align-middle items-center">
        <span className="font-bold my-2">Selecione um baralho!</span>
        <div className="container">
          <button
            onClick={(e) => {
              const items = document.querySelectorAll(".item");
              let maxItems = document.querySelectorAll(".item")?.length;

              setCurrentItem(currentItem - 1);

              if (currentItem >= maxItems) {
                setCurrentItem(0);
              }

              if (currentItem < 0) {
                setCurrentItem(maxItems - 1);
              }

              items.forEach((item) => item.classList.remove("current-item"));

              items[currentItem].scrollIntoView({
                behavior: "smooth",
                inline: "center",
              });

              items[currentItem].classList.add("current-item");
            }}
            className="arrow-left control"
            aria-label="Previous image"
          >
            ◀
          </button>
          <button
            onClick={(e) => {
              const items = document.querySelectorAll(".item");
              let maxItems = document.querySelectorAll(".item")?.length;

              setCurrentItem(currentItem + 1);

              if (currentItem >= maxItems) {
                setCurrentItem(0);
              }

              if (currentItem < 0) {
                setCurrentItem(maxItems - 1);
              }

              items.forEach((item) => item.classList.remove("current-item"));

              items[currentItem].scrollIntoView({
                behavior: "smooth",
                inline: "center",
              });

              items[currentItem].classList.add("current-item");
            }}
            className="arrow-right control"
            aria-label="Next Image"
          >
            ▶
          </button>
          <div className="gallery-wrapper">
            <div className="gallery">
              <img
                onClick={() => {
                  setCurrentDeck(coupleDeck);
                  if (numberOfCardsToPlay > coupleDeck.length)
                    setNumberOfCardsToPlay(coupleDeck.length);
                }}
                src={coupleDeck[0]}
                className={`item ${currentDeck === coupleDeck
                  ? "current-item h-[35vh] py-0"
                  : "py-3"
                  }`}
              />
              <img
                onClick={() => {
                  setCurrentDeck(iveNeverDeck);
                  if (numberOfCardsToPlay > iveNeverDeck.length)
                    setNumberOfCardsToPlay(iveNeverDeck.length);
                }}
                src={iveNeverDeck[0]}
                className={`item ${currentDeck === iveNeverDeck
                  ? "current-item h-[35vh] py-0"
                  : "py-3"
                  }`}
              />
              <img
                onClick={() => {
                  setCurrentDeck(truthOrChallengeDeck);
                  if (numberOfCardsToPlay > truthOrChallengeDeck.length)
                    setNumberOfCardsToPlay(truthOrChallengeDeck.length);
                }}
                src={truthOrChallengeDeck[0]}
                className={`item ${currentDeck === truthOrChallengeDeck
                  ? "current-item h-[35vh] py-0"
                  : "py-3"
                  }`}
              />
              <img
                onClick={() => {
                  setCurrentDeck(findOutDeck);
                  if (numberOfCardsToPlay > findOutDeck.length)
                    setNumberOfCardsToPlay(findOutDeck.length);
                }}
                src={findOutDeck[0]}
                className={`item ${currentDeck === findOutDeck
                  ? "current-item h-[35vh] py-0"
                  : "py-3"
                  }`}
              />
            </div>
          </div>
        </div>
        <p className="mt-1 mb-4">Escolha o numero de cartas</p>
        <div className="flex flex-row mb-3">
          <input
            className="range range-accent"
            type="range"
            min={0}
            max={currentDeck.length}
            value={numberOfCardsToPlay}
            onChange={(e) => setNumberOfCardsToPlay(Number(e.target.value))}
          />
        </div>
        <div>
          <span className="font-bold text-center">{numberOfCardsToPlay}</span>
          <span className="text-xs text-center">/{currentDeck.length}</span>
        </div>
        <div className="flex w-10/12 flex-col place-items-center place-content-center my-3">
          <button
            disabled={currentDeck.length === 0}
            onClick={() => startGame()}
            className="btn-md mb-2 w-full btn btn-success"
          >
            Iniciar▶️
          </button>
          <button
            disabled={currentDeck.length === 0}
            onClick={() => watchDeck()}
            className="btn-md my-2 w-full btn btn-primary"
          >
            Monte seu Jogo ♣️
          </button>
          <div className="m-2 flex flex-row place-content-center place-items-center w-full">
            <button
              onClick={() => document.getElementById("faq_modal")?.showModal()}
              className="btn-md mx-2 btn btn-info"
            >
              Dúvidas 🗯️
            </button>
            <button
              disabled={currentDeck.length === 0}
              onClick={() => resetAndGoHome()}
              className="btn-md mx-2 btn btn-warning"
            >
              Resetar 🔃
            </button>
          </div>
        </div>
      </div>
    );
  };

  const playingComponent = () => {
    return (
      <div className="flex w-full h-screen justify-start self-start items-center flex-col overflow-hidden">
        <div className="z-10 rounded-b-3xl sticky flex-wrap md:flex-nowrap navbar top-0 justify-evenly bg-base-100">
          <a
            onClick={() => {
              document.getElementById("leave_home_modal").showModal();
            }}
            className="btn btn-ghost text-sm"
          >
            Home 🏚️
          </a>
          <a
            onClick={() => {
              document.getElementById("dice_modal")?.showModal();
            }}
            className="btn btn-ghost text-sm"
          >
            Dado 🎲
          </a>
          <a
            onClick={() => {
              document.getElementById("timer_modal")?.showModal();
            }}
            className="btn btn-ghost text-sm"
          >
            Timer⏳
          </a>
        </div>
        <div className="flex flex-row place-content-center place-items-center">
          Cartas restantes: {playingDeck.length - cardIndex - 1}
          <div
            style={{
              backgroundColor: `${playerColor[players.indexOf(playersArrayOrder[cardIndex])]?.background}`,
            }}
            className={`p-1 m-1 border-4 rounded-3xl font-bold`}
          >
            <p className={`${playerColor[players.indexOf(playersArrayOrder[cardIndex])]?.textColor ?? ''}`}>Jogador {playersArrayOrder[cardIndex]}</p>
          </div>
          <Cog8ToothIcon
            className="h-6"
            onClick={() => document.getElementById("player_modal").showModal()}
          />
        </div>
        <div className="flex flex-col items-center h-full self-start pb-16 justify-center overflow-hidden">
          <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className="w-10/12 h-auto flex place-items-center place-content-center overflow-hidden">
            {flip ? (
              <img
                onClick={() => {
                  setFlip(false);
                }}
                className="cursor-pointer md:h-96 h-10/12"
                src={playingDeck[cardIndex]}
              />
            ) : (
              <img
                onClick={() => {
                  setFlip(true);
                }}
                ref={cardBack}
                className={`flip-animation cursor-pointer md:h-96 h-10/12 slide`}
                src={currentDeck[0]}
              />
            )}
          </div>
        </div>
        <div className="btm-nav bg-transparent">
          <button
            onClick={() => goPreviousCard()}
            className={`bg-transparent ${cardIndex === 0 ? "opacity-65 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={cardIndex === 0}
          >
            <ArrowLeftCircleIcon fill="#ca8a04" className="h-10" />
          </button>
          <button
            onClick={() => setFlip(!flip)}
            className="bg-gray-600 text-black text-2xl font-bold rounded-t-2xl"
          >
            <div className="rounded-full bg-white">
              {flip ? (
                <EyeSlashIcon fill="black" className="h-8 p-1" />
              ) : (
                <EyeIcon fill="black" className="h-8 p-1" />
              )}
            </div>
            <span className="btm-nav-label text-white text-sm">
              Virar Carta
            </span>
          </button>
          <button
            onClick={() => goNextCard()}
            className={`bg-transparent ${cardIndex === playingDeck.length - 1 ? "opacity-65 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={cardIndex === playingDeck.length - 1}
          >
            <ArrowRightCircleIcon fill="#84cc16" className="h-10" />
          </button>
        </div>
      </div>
    );
  };

  const FAQModal = () => {
    return (
      <dialog id="faq_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <p className="py-4">
            Custom Game ♣️ - selecione as cartas que deseja jogar do deck
            selecionado!
          </p>
          <p className="py-4">
            Reset Default 🔃 - Volta as configurações ao normal, mantendo o deck
            selecionado!
          </p>
          <p className="py-4">
            Por que os botões estão desabilitado? - Você deve selecionar o deck
            e no mínimo 1 carta para poder habilitar o jogo!
          </p>
          <p className="py-4">
            Dúvidas ou sugestões, mandar no instagran{" "}
            <a href="https://www.instagram.com/matheusjimenez/" target="_blank">
              @Matheusjimenez
            </a>
          </p>
          <p className="py-4">
            Atalhos: Enter para virar a carta / setas {"<-- e -->"} para navegar
          </p>
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
    );
  };

  const rollDice = () => {
    const dice = [...document.querySelectorAll(".die-list")];
    dice.forEach((die) => {
      toggleClasses(die);
      die.dataset.roll = getRandomNumber(1, 6);
      // die.dataset.roll = 1;
    });
  };

  const toggleClasses = (die) => {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  };

  const getRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleHomeClick = () => {
    setStep(steps.CONFIG);
    resetAndGoHome();
  };

  const DiceModal = () => {
    return (
      <dialog id="dice_modal" className="modal">
        <div className="modal-box">
          <div
            onClick={() => {
              rollDice();
            }}
            className="dice"
          >
            <ol className="die-list even-roll" data-roll="1" id="die-1">
              <li className="die-item" data-side="1">
                <span className="dot"></span>
              </li>
              <li className="die-item" data-side="2">
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
              <li className="die-item" data-side="6">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    );
  };

  const TimerModal = () => {
    return (
      <dialog id="timer_modal" className="modal">
        <div className="modal-box">
          <label className="input input-bordered flex items-center gap-2">
            Tempo
            <input
              type="text"
              value={timer}
              onChange={(e) => {
                setTimer(e.target.value);
              }}
              className="grow"
              placeholder="00m 00s"
            />
          </label>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mx-2">Fechar</button>
              <div className="btn mx-2 btn-success">iniciar</div>
            </form>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="h-screen w-full flex flex-row flex-wrap justify-center align-middle items-center">
      {step === steps.CONFIG && deckConfigComponent()}
      {step === steps.PLAYING && playingComponent()}
      {step === steps.WATCH && (
        <WatchWholeDeck
          deck={currentDeck}
          setStep={setStep}
          customSelectedCards={customSelectedCards}
          setCustomSelectedCards={setCustomSelectedCards}
          playCustomGame={playCustomGame}
        />
      )}
      {FAQModal()}
      {DiceModal()}
      {TimerModal()}

      <CharSelect
        players={players}
        MAXIMUM_PLAYER_AMOUNT={MAXIMUM_PLAYER_AMOUNT}
        MINIMUM_PLAYERS_AMOUNT={MINIMUM_PLAYERS_AMOUNT}
        setPlayers={setPlayers}
      />
      <SweetAlert
        text="Deseja realmente sair do jogo?"
        confirmFunction={() => handleHomeClick()}
        modalIdentifier="leave_home_modal"
      />
    </div>
  );
}

export default App;
