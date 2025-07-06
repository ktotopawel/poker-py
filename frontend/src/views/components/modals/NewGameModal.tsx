import { Button, Field, Input, Label, Select } from "@headlessui/react";
import XIcon from "../../../assets/icons/x.svg?react";

const NewGameModal = () => {
  return (
    <div className="h-3/4 w-1/2 bg-modal-background rounded-2xl z-50 flex flex-col p-4">
      <div className="grid grid-cols-2">
        <div className="px-8 flex flex-col gap-6">
          <Field>
            <Label className={"mb-2 text-2xl block"}>Your name:</Label>
            <Input
              className={
                "rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              }
              placeholder="John Doe"
            ></Input>
          </Field>
          <Field>
            <Label className={"mb-2 text-2xl block"}>Number of bots:</Label>
            <Input
              className={
                "rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              }
              placeholder="1 - 4"
            ></Input>
          </Field>
          <Field>
            <Label className={"mb-2 text-2xl block"}>Starting chips:</Label>
            <Input
              className={
                "rounded-2xl h-12 text-4xl bg-background px-4 py-2 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              }
              placeholder="10000"
            ></Input>
          </Field>
          <Field>
            <Label className={"mb-2 text-2xl block"}>Big Blind:</Label>
            <Input
              className={
                "rounded-2xl h-12 text-4xl bg-background px-4 py-2 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              }
              placeholder="50"
            ></Input>
          </Field>
        </div>
        <div>
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
          "rounded bg-action p-4  text-white z-50 w-full self-center font-iransans font-semibold text-2xl mt-auto cursor-pointer"
        }
      >
        Start game
      </Button>
    </div>
  );
};

export default NewGameModal;
