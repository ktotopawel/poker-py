import { useAppSelector } from '../../store/hooks.ts';

const PlayerInfo = () => {
  const playerState = useAppSelector((state) => state.game.player);

  return (
    <div className="flex gap-2">
      <div className="flex-1/2 bg-black/40 shadow-sm shadow-white/20 rounded-lg backdrop-blur-lg border-2 border-white/20 px-6 py-2">
        <div className="flex flex-col items-center">
          <h4 className={'text-nowrap'}>Player's chips:</h4>
          <p className="font-bold text-xl">{playerState.chips}</p>
        </div>
      </div>
      <div className="flex-1/2 bg-black/40 shadow-sm shadow-white/20 rounded-lg backdrop-blur-lg border-2 border-white/20 px-6 py-2">
        <div className="flex flex-col items-center">
          <h4 className={'text-nowrap'}>Player's stake:</h4>
          <p className="font-bold text-xl">{playerState.stake}</p>
        </div>
      </div>
    </div>
  );
};
export default PlayerInfo;
