export function CharNames({ players, setPlayers }) {
  return players.map((Players, index) => {
    return (
      <div key={index} className="flex flex-col">
        <span key={index} className="px-1 py-1 text-sm">
          Jogador {index + 1}
        </span>
        <div className="px-3 w-36 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <input
            value={Players}
            onChange={(event) => {
              let Banjo = [...players];
              Banjo[index] = event.target.value;
              setPlayers(Banjo);
            }}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Digite seu nome..."
          />
        </div>
      </div>
    );
  });
}
