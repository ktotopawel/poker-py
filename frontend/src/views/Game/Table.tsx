import GameInfo from './GameInfo';
import TableCards from './TableCards';

const Table = () => {
  return (
    <div className="bg-felt-green border-gold-metallic border-4 h-3/4 w-3/4 rounded-full inset-shadow-sm relative">
      <GameInfo />
      <TableCards />
    </div>
  );
};

export default Table;
