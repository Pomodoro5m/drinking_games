import {
  XMarkIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { CharNames } from "../components/CharNames";

const CharSelect = ({
  players,
  MAXIMUM_PLAYER_AMOUNT,
  setPlayers,
  MINIMUM_PLAYERS_AMOUNT,
}) => {
  return (
    <dialog className="modal" id="player_modal">
      <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center">
        <div className="h-10/12 w-9/12 flex flex-col overflow-y-auto">
          <div className="modal-action">
            <form method="dialog">
              <button>
                <XMarkIcon className="place-self-end h-6" />
              </button>
            </form>
          </div>
          <div className="bg-slate-900 border-4 border-r-cyan-400 border-t-cyan-400 border-b-pink-500 border-l-pink-500 p-6 rounded-2xl">
            <div className="flex justify-center items-center flex-col">
              <h1 className="text-lg text-white font-bold antialiased py-1">
                JOGADORES
              </h1>
              <CharNames players={players} setPlayers={setPlayers} />
              <div className="items-center justify-center space-x-10">
                <button
                  className="btn bg-pink-500 btn-sm my-4 rounded-full"
                  id="remove_players_button"
                  disabled={players.length <= MINIMUM_PLAYERS_AMOUNT}
                  onClick={(event) => {
                    let newPlayersCount = [...players];
                    if (newPlayersCount.length <= MINIMUM_PLAYERS_AMOUNT)
                      return;
                    newPlayersCount.pop("");
                    setPlayers(newPlayersCount);
                  }}
                >
                  <UserMinusIcon className="size-6 text-white" />
                </button>
                <button
                  className="btn bg-cyan-400 btn-sm my-4 rounded-full"
                  id="add_players_button"
                  disabled={players.length >= MAXIMUM_PLAYER_AMOUNT}
                  onClick={(event) => {
                    let newPlayersArray = [...players];
                    if (newPlayersArray.length >= MAXIMUM_PLAYER_AMOUNT) return;
                    newPlayersArray.push("");
                    setPlayers(newPlayersArray);
                  }}
                >
                  <UserPlusIcon className="size-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default CharSelect;
