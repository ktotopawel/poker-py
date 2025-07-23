import { Button } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import PlayerActionsController from '../../api/playerActionsController.ts';
import clsx from 'clsx';

const PlayerActions = () => {
  const toCall = useAppSelector((state) => state.game.call_amount);
  const gameId = useAppSelector((state) => state.game.game_id);
  const gamePhase = useAppSelector((state) => state.game.phase);
  const dispatch = useAppDispatch();

  const playerActionsController = new PlayerActionsController(dispatch, gameId);

  return (
    <div className="flex gap-2 justify-center ">
      {gamePhase === 'complete' ? (
        <>
          <Button
            onClick={() => {
              playerActionsController.nextRound();
            }}
            className={clsx(
              'bg-black/40 border-2 border-white/20 backdrop-blur-md rounded-lg text-xl px-6 py-2 shadow-md shadow-white/20 transition-shadow duration-300 cursor-pointer',
              'data-active:scale-105 data-active:shadow-xl data-hover:shadow-xl'
            )}
          >
            Start Next Round
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              playerActionsController.call(toCall);
            }}
            className={clsx(
              'bg-black/40 border-2 border-white/20 backdrop-blur-md rounded-lg text-xl px-6 py-2 shadow-md shadow-white/20 transition-shadow duration-300 cursor-pointer',
              'data-active:scale-105 data-active:shadow-xl data-hover:shadow-xl'
            )}
          >
            Check/Call
          </Button>
          <Button
            onClick={() => {
              playerActionsController.fold();
            }}
            className={clsx(
              'bg-black/40 border-2 border-white/20 backdrop-blur-md rounded-lg text-xl px-6 py-2 shadow-md shadow-white/20 transition-shadow duration-300 cursor-pointer',
              'data-active:scale-105 data-active:shadow-xl data-hover:shadow-xl'
            )}
          >
            Fold
          </Button>
          <Button
            onClick={() => {
              //todo implement raising options
              playerActionsController.raise(100);
            }}
            className={clsx(
              'bg-black/40 border-2 border-white/20 backdrop-blur-md rounded-lg text-xl px-6 py-2 shadow-md shadow-white/20 transition-shadow duration-300 cursor-pointer',
              'data-active:scale-105 data-active:shadow-xl data-hover:shadow-xl'
            )}
          >
            Raise
          </Button>
        </>
      )}
    </div>
  );
};

export default PlayerActions;
