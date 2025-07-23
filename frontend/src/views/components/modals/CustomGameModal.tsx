import { Button } from '@headlessui/react';
import InputField from './InputField.tsx';
import { Form, Formik, type FormikHelpers } from 'formik';
import clsx from 'clsx';
import { useAppDispatch } from '../../../store/hooks.ts';
import { modalClose } from '../../../store/slices/modal.slice.ts';
import { startGameThunk } from '../../../store/slices/gameState.slice.ts';
import AppRoutes from '../../../utils/appRoutes.ts';
import { useNavigate } from 'react-router-dom';

const CustomGameModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const startGame = (formikValues: FormikValues) => {
    const { playerName, cpuNum, customChips, bigBlind } = formikValues;

    const gameArgs = {
      playerName: playerName,
      cpuNum: Number(cpuNum),
      customChips: Number(customChips),
      bigBlind: Number(bigBlind),
    };

    dispatch(startGameThunk(gameArgs)).catch((err) => {
      console.error('Error starting game', err);
    });
  };

  const initialValues = {
    playerName: '',
    cpuNum: '',
    customChips: '',
    bigBlind: '',
  };

  type FormikValues = typeof initialValues;

  const onSubmit = (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => {
    const { resetForm } = formikHelpers;

    startGame(values);
    void navigate(AppRoutes.GAME);
    resetForm();
    console.log(values);
  };

  const onReset = () => {
    dispatch(modalClose());
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
              className={clsx(
                'cursor-pointer text-lg border-2 border-gray-600/20 rounded-lg px-2 py-1 flex-1/2 bg-white/5 transition-colors duration-200',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 transition-opacity data-hover:bg-white/10 data-active:shadow-lg data-active:shadow-white/5'
              )}
              type={'reset'}
            >
              Cancel
            </Button>
            <Button
              className={clsx(
                'cursor-pointer text-lg border-2 border-gray-600/20 rounded-lg px-2 py-1 flex-1/2 bg-white/5 transition-colors duration-200',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 transition-opacity data-hover:bg-white/10 data-active:shadow-lg data-active:shadow-white/5'
              )}
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
