import PlayerActions from './PlayerActions';
import PlayerCards from './PlayerCards';
import PlayerInfo from './PlayerInfo.tsx';

const PlayerUI = () => {
  return (
    <div className="translate-y-1/3 absolute bottom-0 flex flex-col items-center overflow-hidden gap-4">
      <div className="translate-y-1/3 flex flex-col items-center gap-3 lg:translate-0">
        <PlayerInfo />
        <PlayerActions />
      </div>
      <PlayerCards />
    </div>
  );
};

export default PlayerUI;
