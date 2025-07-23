import { useAppSelector } from '../../store/hooks';
import type { CPUState, PlayerResults } from '../../types/gameState';
import { getCardImagePath } from '../../utils/cardMapper';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

interface IBot {
  botName: string;
  bot: CPUState;
}

const Bot = ({ botName, bot }: IBot) => {
  const showdownResult = useAppSelector((state) => state.game.showdown_results);
  const gamePhase = useAppSelector((state) => state.game.phase);
  const avatar = createAvatar(botttsNeutral, { radius: 1 }).toDataUri();

  let botResult: PlayerResults | undefined = undefined;

  if (showdownResult) {
    for (let index = 0; index < showdownResult.length; index++) {
      const result = showdownResult[index];

      if (result.name == botName) {
        botResult = result;
      }
    }
  }

  const getCardsPath = () => {
    if (!botResult) return ['', ''];

    const firstCardImagePath = getCardImagePath(botResult.hand[0]);
    const secondCardImagePath = getCardImagePath(botResult.hand[1]);
    return [firstCardImagePath, secondCardImagePath];
  };

  const cards = getCardsPath();
  return (
    <>
      <div className="flex bg-black/40 backdrop-blur-lg rounded-lg border-2 border-white/20 p-2 text-sm lg:text-lg">
        {gamePhase === 'complete' ? (
          cards[0] !== '' &&
          cards[1] !== '' && (
            <div className={'flex flex-col items-center gap-2 lg:flex-row'}>
              <div className={'self-start'}>
                {botName}:
                <img className={'hidden lg:block'} src={avatar} alt={'Avatar'} />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <div className="flex justify-center gap-1">
                  {cards.map((card, index) => (
                    <img
                      src={card}
                      alt={`${botName}'s card ${index + 1}`}
                      key={index}
                      className="w-1/2 max-w-24"
                    />
                  ))}
                </div>
                {botResult?.is_winner && <p className="text-gold-metallic">WINNER!</p>}
                {botResult && botResult?.hand_description && <p>{botResult.hand_description}</p>}
              </div>
            </div>
          )
        ) : (
          <div className="h-full flex flex-col gap-2 lg:flex-row">
            <h2 className="text-lg lg:border-r-2 border-r-white/20 lg:pr-2">
              {botName}
              <img className={'hidden lg:block'} src={avatar} alt={'Avatar'} />
            </h2>
            <div className="flex justify-between flex-col">
              <div className="grid grid-cols-2 gap-2">
                <h4>Action:</h4>
                <p className="text-action">{bot.status}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <h4>Chips: </h4>
                <p className="text-chip-red">{bot.chips}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <h4>Stake:</h4>
                <p className="text-accent">{bot.stake}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bot;
