import { Button, Field, Input, Label } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  setGameId,
  updateGameState,
  type GameState,
} from "../../../store/slices/gameState.slice";
import { close } from "../../../store/slices/modal.slice";

const NewGameModal = () => {
  const dispatch = useAppDispatch();
  const [playerName, setPlayerName] = useState<string>("");
  const handleStartGame = () => {
    axios
      .post("http://localhost:5000/api/game", { username: playerName })
      .then((response) => {
        const gameId = response.data.game_id;
        dispatch(setGameId(gameId));

        axios
          .get(`http://localhost:5000/api/game/${Number(gameId)}/start-round`)
          .then((response) => {
            const gameState: GameState = response.data["game_state"];

            dispatch(updateGameState(gameState));
            dispatch(close());
          })
          .catch((err) => {
            throw new Error("Error starting round: ", err);
          });
      })
      .catch((err) => {
        throw new Error("Error initializing game: ", err);
      });
  };

  return (
    <div className="h-3/4 w-1/2 bg-modal-background rounded-2xl z-50 flex flex-col p-4">
      <div className="pt-8 grid grid-cols-2">
        <div className="px-12 flex flex-col gap-6">
          <Field>
            <Label className={"mb-2 text-2xl block"}>Your name:</Label>
            <Input
              className={
                "rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full"
              }
              placeholder="John Doe"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            ></Input>
          </Field>
          <Field disabled>
            <Label className={"mb-2 text-2xl block"}>Number of bots:</Label>
            <Input
              className={
                "cursor-not-allowed rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full"
              }
              placeholder="COMING SOON"
            ></Input>
          </Field>
          <Field disabled>
            <Label className={"mb-2 text-2xl block"}>Starting chips:</Label>
            <Input
              className={
                "cursor-not-allowed rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full"
              }
              placeholder="COMING SOON"
            ></Input>
          </Field>
          <Field disabled>
            <Label className={"mb-2 text-2xl block"}>Big Blind:</Label>
            <Input
              className={
                "cursor-not-allowed rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full"
              }
              placeholder="COMING SOON"
            ></Input>
          </Field>
        </div>
        <div className="px-12">
          <h1 className="text-8xl font-semibold text-gold-metallic mb-4">
            Poker-py
          </h1>
          <p className="text-2xl">
            This is a simple poker app, connecting a python backend API with a
            frontend web app.
          </p>
        </div>
      </div>
      <Button
        className={
          "rounded bg-felt-green p-4  text-gold-metallic z-50 w-full self-center font-iransans font-semibold text-2xl mt-auto cursor-pointer"
        }
        onClick={() => {
          handleStartGame();
        }}
      >
        Start game
      </Button>
    </div>
  );
};

export default NewGameModal;
