import type { GameState } from '../store/slices/gameState.slice.ts';

type ActionReturn = {
  game_state: GameState;
  success: string;
};

type InitReturn = {
  game_state: GameState;
  game_id: number;
  player_name: string;
  success: string;
};

type StartRoundReturn = {
  game_state: GameState;
  success: string;
};

export type { InitReturn, ActionReturn, StartRoundReturn };
