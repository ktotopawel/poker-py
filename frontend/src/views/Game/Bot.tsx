import { useAppSelector } from "../../store/hooks";
import type { CPUState, PlayerResults } from "../../types/gameState";
import { getCardImagePath } from "../../utils/cardMapper";

interface IBot {
  botName: string;
  bot: CPUState;
}

const Bot = ({ botName, bot }: IBot) => {
  const showdownResult = useAppSelector((state) => state.game.showdown_results);

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
    if (!botResult) return ["", ""];

    const firstCardImagePath = getCardImagePath(botResult.hand[0]);
    const secondCardImagePath = getCardImagePath(botResult.hand[1]);
    return [firstCardImagePath, secondCardImagePath];
  };

  const cards = getCardsPath();
  return (
    <>
      <div className="grid grid-cols-2 gap-2 bg-modal-background px-4 py-2 rounded-l-2xl">
        {cards[0] !== "" && cards[1] !== "" && (
          <div>
            <div className="mb-2">
              <p>Cards for {botName}:</p>
            </div>
            <div className="flex gap-1">
              {cards.map((card, index) => (
                <img
                  src={card}
                  alt={`${botName}'s card ${index + 1}`}
                  key={index}
                  className="h-32"
                />
              ))}
            </div>
            {botResult?.is_winner && (
              <p className="text-gold-metallic">WINNER!</p>
            )}
            {botResult?.hand_description && (
              <p className="mt-2">
                {botName} got: {botResult.hand_description}
              </p>
            )}
          </div>
        )}
        <div className="w-52 h-full flex flex-col gap-2">
          <h2 className="text-2xl flex-none">{botName}</h2>
          <div className="flex flex-col justify-between flex-auto">
            <div className="text-xl flex gap-1">
              <h4>Bot action:</h4>
              <p className="text-action">{bot.status}</p>
            </div>
            <div className="text-xl flex gap-1">
              <h4>Chips: </h4>
              <p className="text-chip-red">{bot.chips}</p>
            </div>
            <div className="text-xl flex gap-1">
              <h4>Stake:</h4>
              <p className="text-accent">{bot.stake}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bot;
