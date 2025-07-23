import { useAppSelector } from '../../store/hooks';
import Bot from './Bot';

const Bots = () => {
  const bots = useAppSelector((state) => state.game.bots_state);

  const botNames = Object.keys(bots);
  const rightBots = [];
  const leftBots = [];

  for (let i = 0; i < botNames.length; i++) {
    if (i % 2 === 0) {
      rightBots.push(botNames[i]);
    } else {
      leftBots.push(botNames[i]);
    }
  }

  return (
    <div className="absolute left-0 w-screen h-1/3 pointer-events-none flex justify-between">
      <div className="h-full flex flex-col justify-between gap-4 max-w-1/4 lg:ml-4">
        {leftBots.map((botName) => {
          const bot = bots[botName];

          return <Bot botName={botName} bot={bot} key={botName} />;
        })}
      </div>
      <div className="h-full flex flex-col justify-between gap-4 max-w-1/4 lg:mr-6">
        {rightBots.map((botName) => {
          const bot = bots[botName];
          return <Bot botName={botName} bot={bot} key={botName} />;
        })}
      </div>
    </div>
  );
};

export default Bots;
