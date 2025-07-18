import type { GameState } from '../store/slices/gameState.slice.ts';

type ActionReturn = {
  game_state: GameState;
  success: boolean;
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

export type StartGameArgs = {
  playerName: string;
  customChips: number;
  cpuNum: number;
  bigBlind: number;
};

export type PlayerActionArgs = {
  gameId: number;
  action: ActionType;
  amount?: number;
};

type ActionType = 'call' | 'raise' | 'fold';

export type { InitReturn, ActionReturn, StartRoundReturn };
