import { createSlice } from "@reduxjs/toolkit";
import type { CPUState, GamePhases, PlayerState } from "../../types/gameState";

export interface GameState {
  bank_chips: number;
  bots_state: {
    [key: string]: CPUState;
  };
  call_amount: number;
  can_check: boolean;
  current_stake: number;
  game_over: boolean;
  phase: GamePhases;
  player: PlayerState;
  round_number: number;
  table_cards: string[];
  waiting_for_player: boolean;
}

const initialState: GameState = {
  bank_chips: 0,
  bots_state: {
    CPU0: {
      status: "",
      chips: 0,
      game_over: true,
      is_folded: false,
      is_dealer: true,
      stake: 0,
    },
  },
  call_amount: 0,
  can_check: false,
  current_stake: 0,
  game_over: true,
  phase: "waiting",
  player: {
    chips: 0,
    game_over: true,
    is_folded: false,
    is_dealer: false,
    stake: 0,
  },
  round_number: 0,
  table_cards: [],
  waiting_for_player: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});

// eslint-disable-next-line no-empty-pattern
export const {} = gameSlice.actions;

export default gameSlice.reducer;
