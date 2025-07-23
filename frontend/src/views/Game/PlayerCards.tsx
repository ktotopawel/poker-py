import { useAppSelector } from '../../store/hooks';
import { getCardImagePath } from '../../utils/cardMapper';
import clsx from 'clsx';

const PlayerCards = () => {
  const playerHand = useAppSelector((state) => state.game.player.hand);
  const isFolded = useAppSelector((state) => state.game.player.is_folded);

  if (!playerHand || playerHand.length < 2 || !playerHand[0] || !playerHand[1]) {
    return null;
  }

  const getPlayerCards = () => {
    const firstCardImagePath = getCardImagePath(playerHand[0]);
    const secondCardImagePath = getCardImagePath(playerHand[1]);
    return [firstCardImagePath, secondCardImagePath];
  };

  const cardPaths = getPlayerCards();

  if (cardPaths.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex justify-center scale-66 lg:scale-100">
      <img
        className={clsx(`-rotate-2 translate-x-2 transition-opacity duration-200 `, {
          'opacity-25': isFolded,
        })}
        src={cardPaths[0]}
        alt="Player card 1"
      />
      <img
        className={clsx(`rotate-2 -translate-x-2 transition-opacity duration-200  `, {
          'opacity-25': isFolded,
        })}
        src={cardPaths[1]}
        alt="Player card 2"
      />
    </div>
  );
};

export default PlayerCards;
