import { Button, Field, Input, Label } from '@headlessui/react';
import { useState } from 'react';

const CustomGameModal = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [botsAmount, setBotsAmount] = useState<number>(3);
  const [startingChips, setStartingChips] = useState<number>(10000);
  const [bigBlind, setBigBlind] = useState<number>(50);

  return (
    <div className="h-3/4 w-1/2 bg-modal-background rounded-2xl z-50 flex flex-col p-4">
      <div className="pt-8 grid grid-cols-2">
        <div className="px-12 flex flex-col gap-6">
          <Field>
            <Label className={'mb-2 text-2xl block'}>Your name:</Label>
            <Input
              className={
                'rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full'
              }
              placeholder="John Doe"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              max={3}
            ></Input>
          </Field>
          <Field>
            <Label className={'mb-2 text-2xl block'}>Number of bots:</Label>
            <Input
              className={
                ' rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full'
              }
              value={botsAmount}
              onChange={(e) => {
                setBotsAmount(Number(e.target.value));
              }}
              placeholder="1-3"
            ></Input>
          </Field>
          <Field>
            <Label className={'mb-2 text-2xl block'}>Starting chips:</Label>
            <Input
              className={
                ' rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full'
              }
              value={startingChips}
              onChange={(e) => {
                setStartingChips(Number(e.target.value));
              }}
              placeholder="10000"
            ></Input>
          </Field>
          <Field>
            <Label className={'mb-2 text-2xl block'}>Big Blind:</Label>
            <Input
              className={
                'rounded-2xl h-12 text-4xl bg-background px-6 py-4 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 w-full'
              }
              placeholder="50"
              value={bigBlind}
              onChange={(e) => {
                setBigBlind(Number(e.target.value));
              }}
            ></Input>
          </Field>
        </div>
        <div className="px-12">
          <h1 className="text-8xl font-semibold text-gold-metallic mb-4">Poker-py</h1>
          <p className="text-2xl">
            This is a simple poker app, connecting a python backend API with a frontend web app.
            Basic game working, features left to implement:
            <p>- Custom bot amount.</p> <p>- Custom chips/BB.</p> <p>- Raise amount choice.</p>{' '}
            <p>- Animations, bot choice display.</p>
          </p>
        </div>
      </div>
      <Button
        className={
          'rounded bg-felt-green p-4  text-gold-metallic z-50 w-full self-center font-iransans font-semibold text-2xl mt-auto cursor-pointer'
        }
        onClick={() => {
          // toDo add logic to implement custom game start
        }}
      >
        Start game
      </Button>
    </div>
  );
};

export default CustomGameModal;
