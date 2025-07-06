import { useAppSelector } from "../../store/hooks";
import type { CPUState, PlayerResults } from "../../types/gameState";
import { getCardImagePath } from "../../utils/cardMapper";

interface IBot {
  botName: string;
  bot: CPUState;
}

const Bot = ({ botName, bot }: IBot) => {
  const gamePhase = useAppSelector((state) => state.game.phase);
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
      <div>
        {cards[0] !== "" && cards[1] !== "" && (
          <div>
            <p>Cards for {botName}:</p>
            {cards.map((card, index) => (
              <img
                src={card}
                alt={`${botName}'s card ${index + 1}`}
                key={index}
                style={{
                  width: "40px",
                  height: "56px",
                  border: "1px solid red",
                }}
              />
            ))}
          </div>
        )}
        <div>
          <h2>{botName}</h2>
          <p className="text-warning">{bot.status}</p>
          <div>
            <h4>Chips: </h4>
            <p>{bot.chips}</p>
          </div>
          <div>
            <h4>Stake:</h4>
            <p>{bot.stake}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bot;
