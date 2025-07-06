import { Button } from "@headlessui/react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateGameState } from "../../store/slices/gameState.slice";

const PlayerActions = () => {
  const toCall = useAppSelector((state) => state.game.call_amount);
  const gameId = useAppSelector((state) => state.game.game_id);
  const dispatch = useAppDispatch();

  const handleCheckAndCall = () => {
    axios
      .post(`http://localhost:5000/api/game/${gameId}/action`, {
        action: "call",
        amount: toCall,
      })
      .then((res) => {
        const gameState = res.data.game_state;

        dispatch(updateGameState(gameState));
      });
  };

  const handleFold = () => {
    axios
      .post(`http://localhost:5000/api/game/${gameId}/action`, {
        action: "fold",
      })
      .then((res) => {
        const gameState = res.data.game_state;

        dispatch(updateGameState(gameState));
      });
  };

  const handleRaise = () => {
    axios
      .post(`http://localhost:5000/api/game/${gameId}/action`, {
        action: "raise",
        amount: 100,
      })
      .then((res) => {
        const gameState = res.data.game_state;

        dispatch(updateGameState(gameState));
      });
  };

  return (
    <div className="flex gap-2 justify-center mb-4 ">
      <Button
        onClick={() => {
          handleCheckAndCall();
        }}
        className={
          "bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl"
        }
      >
        Check/Call
      </Button>
      <Button
        onClick={() => {
          handleFold();
        }}
        className={
          "bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl"
        }
      >
        Fold
      </Button>
      <Button
        onClick={() => {
          handleRaise();
        }}
        className={
          "bg-surface py-2 px-4 text-2xl shadow-velvet-red shadow-sm cursor-pointer rounded-xl"
        }
      >
        Raise
      </Button>
    </div>
  );
};

export default PlayerActions;
