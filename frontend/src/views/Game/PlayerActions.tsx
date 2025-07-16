import { Button } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import playerActionsController from '../../api/playerActionsController.ts';
import { updateGameState } from '../../store/slices/gameState.slice.ts';

const PlayerActions = () => {
  const toCall = useAppSelector((state) => state.game.call_amount);
  const gameId = useAppSelector((state) => state.game.game_id);
  const gamePhase = useAppSelector((state) => state.game.phase);
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-2 justify-center mb-4 ">
      {gamePhase === 'complete' ? (
        <>
          <Button
            onClick={() => {
              playerActionsController
                .startNextRound(String(gameId))
                .then((response) => {
                  dispatch(updateGameState(response));
                })
                .catch((error) => {
                  console.error('Error processing player actions', error);
                });
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
              playerActionsController
                .checkAndCall(String(gameId), toCall)
                .then((response) => {
                  dispatch(updateGameState(response));
                })
                .catch((error) => {
                  console.error('Error processing player actions', error);
                });
            }}
            className={
              'bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl'
            }
          >
            Check/Call
          </Button>
          <Button
            onClick={() => {
              playerActionsController
                .fold(String(gameId))
                .then((response) => {
                  dispatch(updateGameState(response));
                })
                .catch((error) => {
                  console.error('Error processing player actions', error);
                });
            }}
            className={
              'bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl'
            }
          >
            Fold
          </Button>
          <Button
            onClick={() => {
              playerActionsController
                .raise(String(gameId), 100)
                .then((response) => {
                  dispatch(updateGameState(response));
                })
                .catch((error) => {
                  console.error('Error processing player actions', error);
                });
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
