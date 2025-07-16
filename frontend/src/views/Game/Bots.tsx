import { useAppSelector } from '../../store/hooks';
import Bot from './Bot';

const Bots = () => {
  const bots = useAppSelector((state) => state.game.bots_state);

  const botNames = Object.keys(bots);

  return (
    <div className="absolute right-0 top-0 h-full w-1/5 flex flex-col justify-around">
      {botNames.map((botName) => {
        const bot = bots[botName];

        return <Bot botName={botName} bot={bot} key={botName} />;
      })}
    </div>
  );
};

export default Bots;
