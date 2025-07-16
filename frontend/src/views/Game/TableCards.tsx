import { useAppSelector } from '../../store/hooks';
import { getCardImagePath } from '../../utils/cardMapper';

const TableCards = () => {
  const tableCards = useAppSelector((state) => state.game.table_cards);

  const getTableCardPaths = () => {
    const tableCardPaths: string[] = [];

    for (let index = 0; index < tableCards.length; index++) {
      const card = tableCards[index];

      tableCardPaths.push(getCardImagePath(card));
    }

    return tableCardPaths;
  };

  const tableCardPaths = getTableCardPaths();
  return (
    <div className="flex gap-2 justify-center items-center h-full w-full">
      {tableCardPaths.map((cardPath, index) => (
        <img className="h-64" src={cardPath} alt={`Table card ${index + 1}`} />
      ))}
    </div>
  );
};

export default TableCards;
