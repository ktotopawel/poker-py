import { Button } from '@headlessui/react';
// import { startGameThunk } from '../../../store/slices/gameState.slice.ts';
// import type { StartGameArgs } from '../../../types/api.d.ts';
// import { useAppDispatch } from '../../../store/hooks.ts';
import InputField from './InputField.tsx';
import { Form, Formik, type FormikValues } from 'formik';

const CustomGameModal = () => {
  // const dispatch = useAppDispatch();

  // const startGame = () => {
  //   const gameArgs: StartGameArgs = {
  //     playerName: playerName,
  //     cpuNum: botsAmount,
  //     customChips: startingChips,
  //     bigBlind: bigBlind,
  //   };
  //
  //   dispatch(startGameThunk(gameArgs)).catch((err) => {
  //     console.error('Error starting game', err);
  //   });
  // };

  const initialValues = {
    playerName: '',
    cpuNum: '',
    customChips: '',
    bigBlind: '',
  };

  const onSubmit = (values: FormikValues) => {
    console.log(values);
  };

  const onReset = () => {
    console.log('form reset success');
  };

  return (
    <div className={'backdrop-blur-md border-gray-600/20 border-2 bg-black/60 rounded-xl'}>
      <h2 className={'text-2xl font-semibold border-b-gray-600/20 border-b-2 pb-2 mb-2 px-6 pt-6'}>
        Custom Game
      </h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
        <Form className={'px-6 pb-6 pt-2'}>
          <div className="flex flex-col gap-2">
            <InputField
              label={'Player name'}
              name={'playerName'}
              description={'What do you want to be called?'}
              placeholder={'PokerPlayer'}
              type={'text'}
            />
            <InputField
              label={'Bots amount'}
              name={'cpuNum'}
              description={'How many bots do you wish to play against?'}
              type={'number'}
              placeholder={'3'}
            />
            <InputField
              label={'Custom chips'}
              name={'customChips'}
              description={'How many chips do you want to start with?'}
              type={'number'}
              placeholder={'1000'}
            />
            <InputField
              label={'Big blind'}
              name={'bigBlind'}
              description={'What should be the Big Blind amount?'}
              type={'number'}
              placeholder={'50'}
            />
          </div>
          <div className="flex justify-stretch gap-2 mt-4">
            <Button
              className={
                'cursor-pointer text-lg border-2 border-gray-600/20 rounded-lg px-2 py-1 bg-transparent flex-1/2'
              }
              type={'reset'}
            >
              Cancel
            </Button>
            <Button
              className={
                'cursor-pointer text-lg border-2 border-gray-600/20 rounded-lg px-2 py-1 bg-transparent flex-1/2'
              }
              type={'submit'}
            >
              Start Game
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CustomGameModal;
