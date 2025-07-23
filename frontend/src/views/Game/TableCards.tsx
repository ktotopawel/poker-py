import { useAppSelector } from '../../store/hooks';
import { getCardImagePath } from '../../utils/cardMapper';

const TableCards = () => {
  const tableCards = useAppSelector((state) => state.game.table_cards);

  const getTableCardPaths = () => {
    const tableCardPaths: { path: string; card: string }[] = [];

    for (let index = 0; index < tableCards.length; index++) {
      const card = tableCards[index];

      tableCardPaths.push({ path: getCardImagePath(card), card: card });
    }

    return tableCardPaths;
  };

  const tableCardPaths = getTableCardPaths();
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div className="flex gap-2 justify-center items-center w-2/3 h-1/2 flex-wrap">
        {tableCardPaths.map((cardPath, index) => (
          <img
            className="max-w-1/4 max-h-1/2"
            key={cardPath.card}
            src={cardPath.path}
            alt={`Table card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TableCards;
