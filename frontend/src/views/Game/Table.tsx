import GameInfo from './GameInfo';
import TableCards from './TableCards';

const Table = () => {
  return (
    <div className="relative bg-radial from-felt-green via-felt-green-middle to-felt-green-dark w-full h-3/4 rounded-full border-6 border-gold-leaf inset-shadow inset-shadow-black flex flex-col items-center">
      <GameInfo />
      <TableCards />
    </div>
  );
};

export default Table;
