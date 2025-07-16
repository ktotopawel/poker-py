import { useAppSelector } from '../../store/hooks';

const GameInfo = () => {
  const bankChips = useAppSelector((state) => state.game.bank_chips);
  const currentStake = useAppSelector((state) => state.game.current_stake);

  return (
    <div className="absolute top-8 w-full flex justify-center gap-4 items-center">
      <div className="flex flex-col bg-modal-background px-4 py-2 rounded-2xl gap-2 justify-center items-center">
        <h3 className="text-4xl">Bank Chips</h3>
        <p className="text-6xl text-gold-metallic">{bankChips}</p>
      </div>
      <div className="flex flex-col bg-modal-background px-4 py-2 rounded-2xl gap-2 justify-center items-center">
        <h3 className="text-4xl">Current Stake</h3>
        <p className="text-6xl text-gold-metallic">{currentStake}</p>
      </div>
    </div>
  );
};

export default GameInfo;
