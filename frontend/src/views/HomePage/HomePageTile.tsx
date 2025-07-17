import { useNavigate } from 'react-router-dom';
import { CustomGameImage, QuickGameImage } from '../../assets/imgs';
import { Button } from '@headlessui/react';
import { modalOpen } from '../../store/slices/modal.slice.ts';
import { ModalTypes } from '../components/Modal.tsx';
import { startGameThunk } from '../../store/slices/gameState.slice.ts';
import type { AppDispatch } from '../../store/store.ts';
import AppRoutes from '../../utils/appRoutes.ts';
import { useAppDispatch } from '../../store/hooks.ts';

const HOMEPAGE_SETTINGS = {
  quickGame: {
    buttonText: 'Play now',
    description: 'Start a quick game with the default settings.',
    image: QuickGameImage,
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
  },
  customGame: {
    buttonText: 'Create game',
    description:
      'Start a custom game with custom number of bots, starting chips and Big Blind amount.',
    image: CustomGameImage,
    onClick: (dispatch: AppDispatch) => {
      dispatch(modalOpen({ type: ModalTypes.CUSTOM_GAME }));
    },
    title: 'Custom Game',
  },
} as const;

type SettingsType = keyof typeof HOMEPAGE_SETTINGS;

interface IHomePageTitle {
  type: SettingsType;
}

const HomePageTile = ({ type }: IHomePageTitle) => {
  const { image, title, onClick, description, buttonText } = HOMEPAGE_SETTINGS[type];
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="w-120 bg-modal-background rounded-xl shadow-md max-h-full flex flex-col items-center p-4 gap-2">
      <div className="flex items-center justify-center overflow-hidden">
        <img
          className="object-contain w-full h-full rounded-lg"
          src={image}
          alt={`${title} image`}
        />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="mt-4 text-2xl">{title}</h3>
        <p className="text-center text-muted">{description}</p>
      </div>
      <Button
        className="w-full mt-auto text-center text-2xl bg-accent text-modal-background p-2 rounded-lg"
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
