import { Button } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import PlayerActionsController from '../../api/playerActionsController.ts';

const PlayerActions = () => {
  const toCall = useAppSelector((state) => state.game.call_amount);
  const gameId = useAppSelector((state) => state.game.game_id);
  const gamePhase = useAppSelector((state) => state.game.phase);
  const dispatch = useAppDispatch();

  const playerActionsController = new PlayerActionsController(dispatch, gameId);

  return (
    <div className="flex gap-2 justify-center mb-4 ">
      {gamePhase === 'complete' ? (
        <>
          <Button
            onClick={() => {
              playerActionsController.nextRound();
            }}
            className={
              'bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl'
            }
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
            className={
              'bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl'
            }
          >
            Check/Call
          </Button>
          <Button
            onClick={() => {
              playerActionsController.fold();
            }}
            className={
              'bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl'
            }
          >
            Fold
          </Button>
          <Button
            onClick={() => {
              //todo implement raising options
              playerActionsController.raise(100);
            }}
            className={
              'bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl'
            }
          >
            Raise
          </Button>
        </>
      )}
    </div>
  );
};

export default PlayerActions;
