import { XMarkIcon } from "@heroicons/react/24/solid";
import { CharNames } from "../components/CharNames";

const CharSelect = ({
  isVisible,
  onClose,
  players,
  MAXIMUM_PLAYER_AMOUNT,
  setPlayers,
}) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="h-10/12 w-9/12 flex flex-col overflow-y-auto">
        <XMarkIcon className="place-self-end h-6" onClick={() => onClose()} />
        <div className="bg-slate-900 border-4 border-r-cyan-400 border-t-cyan-400 border-b-pink-500 border-l-pink-500 p-6 rounded-2xl">
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-base text-white font-bold antialiased py-1">
              Jogadores
            </h1>
            <CharNames players={players} setPlayers={setPlayers} />
            <button
              className="btn btn-success btn-sm my-4"
              id="add_players_button"
              disabled={players.length >= MAXIMUM_PLAYER_AMOUNT}
              onClick={(event) => {
                let newPlayersArray = [...players];
                if (newPlayersArray.length >= MAXIMUM_PLAYER_AMOUNT) return;
                newPlayersArray.push("");
                setPlayers(newPlayersArray);
              }}
            >
              + Adicionar Jogador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharSelect;
