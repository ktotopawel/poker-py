import { useAppSelector } from '../../store/hooks';

const GameInfo = () => {
  const bankChips = useAppSelector((state) => state.game.bank_chips);
  const currentStake = useAppSelector((state) => state.game.current_stake);

  return (
    <div
      className={
        'w-full flex gap-2 bg-black/40 backdrop-blur-md rounded-xl border-2 border-white/20 items-stretch absolute -top-1/8 shadow-md shadow-white/10 lg:w-1/6'
      }
    >
      <div className={'flex-1/2 flex flex-col items-center py-6 pl-6'}>
        <h3 className={'text-lg font-semibold'}>Bank chips</h3>
        <div className={'text-2xl font-bold'}>{bankChips}</div>
      </div>
      <div className={'w-0.5 bg-white/20 self-stretch'} />
      <div className={'flex-1/2 flex flex-col items-center py-6 pr-6'}>
        <h3 className={'text-lg font-semibold'}>Current Stake</h3>
        <div className={'text-2xl font-bold'}>{currentStake}</div>
      </div>
    </div>
  );
};

export default GameInfo;
