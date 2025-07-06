import { useAppSelector } from "../../store/hooks";
import PlayerActions from "./PlayerActions";
import PlayerCards from "./PlayerCards";

const PlayerUI = () => {
  const playerState = useAppSelector((state) => state.game.player);

  return (
    <div className="absolute bottom-5">
      <div className="flex gap-2">
        <div className="w-full flex justify-center items-start -translate-4">
          <div className="flex flex-col items-center bg-modal-background rounded-xl px-4 py-2 text-2xl">
            <h4>Player's chips:</h4>
            <p className="text-red-600">{playerState.chips}</p>
          </div>
        </div>
        <div className="w-full flex justify-center items-start -translate-4">
          <div className="flex flex-col items-center bg-modal-background rounded-xl px-4 py-2 text-2xl">
            <h4>Player's stake:</h4>
            <p className="text-red-600">{playerState.stake}</p>
          </div>
        </div>
      </div>
      <PlayerActions />
      <PlayerCards />
    </div>
  );
};

export default PlayerUI;
