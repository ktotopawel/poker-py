import PlayerUI from "./PlayerUI";
import Table from "./Table";

const Game = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Table />
      <PlayerUI />
    </div>
  );
};

export default Game;
