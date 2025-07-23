import { useNavigate } from 'react-router-dom';
import { Button } from '@headlessui/react';
import { modalOpen } from '../../store/slices/modal.slice.ts';
import { ModalTypes } from '../components/Modal.tsx';
import { startGameThunk } from '../../store/slices/gameState.slice.ts';
import type { AppDispatch } from '../../store/store.ts';
import AppRoutes from '../../utils/appRoutes.ts';
import { useAppDispatch } from '../../store/hooks.ts';
import { CoinsIcon, CpuIcon, PokerChipIcon, SlidersIcon, TimerIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

const HOMEPAGE_SETTINGS = {
  quickGame: {
    buttonText: 'Play now',
    description: (
      <>
        <p className={'text-center'}>Start a quick game with the default settings.</p>
        <ul className={'flex flex-col gap-2 px-4 mt-2'}>
          <li className={'flex justify-start items-center gap-2'}>
            <CpuIcon size={'1.5rem'} />{' '}
            <span>
              Play against <span className="font-bold text-white">3</span> CPU's
            </span>
          </li>
          <li className={'flex justify-start items-center gap-2'}>
            <CoinsIcon size={'1.5rem'} />{' '}
            <span>
              <span className={'font-bold text-white'}>10000</span> starting chips
            </span>
          </li>
          <li className={'flex justify-start items-center gap-2'}>
            <PokerChipIcon size={'1.5rem'} />{' '}
            <span>
              <span className={'font-bold text-white'}>50</span> chips big blind
            </span>
          </li>
        </ul>
      </>
    ),
    onClick: (dispatch: AppDispatch, navigate: ReturnType<typeof useNavigate>) => {
      const defaultGameArgs = {
        playerName: 'Player',
        customChips: 1000,
        cpuNum: 3,
        bigBlind: 10,
      };

      dispatch(startGameThunk(defaultGameArgs))
        .then((action) => {
          if (startGameThunk.fulfilled.match(action)) {
            void navigate(AppRoutes.GAME);
          }
        })
        .catch((error) => {
          //todo add a modal for errors
          console.error('Error starting game', error);
        });
    },
    title: 'Quick Game',
    icon: <TimerIcon size={'4rem'} />,
  },
  customGame: {
    buttonText: 'Create game',
    description: (
      <>
        <p className={'text-center'}>Choose your own rules.</p>
        <ul className={'flex flex-col gap-2 pl-2 mt-2 items-stretch'}>
          <li className={'flex justify-start items-center gap-2'}>
            <CpuIcon size={'1.5rem'} />{' '}
            <span>
              Play against <span className="font-bold text-white">1-3</span> CPU's
            </span>
          </li>
          <li className={'flex justify-start items-center gap-2'}>
            <CoinsIcon size={'1.5rem'} /> <span>Any number of chips.</span>
          </li>
          <li className={'flex justify-start items-center gap-2'}>
            <PokerChipIcon size={'1.5rem'} /> <span>Custom big blinds.</span>
          </li>
        </ul>
      </>
    ),
    onClick: (dispatch: AppDispatch) => {
      dispatch(modalOpen({ type: ModalTypes.CUSTOM_GAME }));
    },
    title: 'Custom Game',
    icon: <SlidersIcon size={'4rem'} />,
  },
} as const;

type SettingsType = keyof typeof HOMEPAGE_SETTINGS;

interface IHomePageTitle {
  type: SettingsType;
}

const HomePageTile = ({ type }: IHomePageTitle) => {
  const { title, onClick, description, buttonText, icon } = HOMEPAGE_SETTINGS[type];
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        'w-full backdrop-blur-lg bg-black/20 rounded-xl p-6 flex flex-col gap-4 border-2 border-white/20 transition-shadow duration-300',
        'hover:shadow-xl hover:shadow-white/10'
      )}
    >
      <div className={'w-full flex justify-center items-center h-20'}>{icon}</div>
      <div className="flex flex-col items-center">
        <h3 className=" text-2xl">{title}</h3>
        {description}
      </div>
      <Button
        className={clsx(
          'w-full mt-auto text-center text-2xl p-2 rounded-lg bg-accent text-chip-black transition-transform duration-300 cursor-pointer',
          'data-hover:scale-105 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-accent'
        )}
        onClick={() => {
          onClick(dispatch, navigate);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default HomePageTile;
