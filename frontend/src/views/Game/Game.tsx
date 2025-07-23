import Bots from './Bots';
import PlayerUI from './PlayerUI';
import Table from './Table';
import { useAppSelector } from '../../store/hooks.ts';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../../utils/appRoutes.ts';

const Game = () => {
  const gameId = useAppSelector((state) => state.game.game_id);
  const navigate = useNavigate();

  if (gameId === 0) void navigate(AppRoutes.NOT_FOUND);

  return (
    <div className="relative max-h-screen h-screen flex items-center justify-center px-2 overflow-hidden">
      <Table />
      <PlayerUI />
      <Bots />
    </div>
  );
};

export default Game;
