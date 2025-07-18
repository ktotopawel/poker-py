import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CPUState, GamePhases, PlayerResults, PlayerState } from '../../types/gameState';
import instance from '../../api/axiosInstance.ts';
import type {
  ActionReturn,
  InitReturn,
  PlayerActionArgs,
  StartGameArgs,
  StartRoundReturn,
} from '../../types/api.d.ts';

export interface GameState {
  game_id: number;
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
  showdown_results: PlayerResults[] | null;

  status: 'idle' | 'loading' | 'error';
}

const initialState: GameState = {
  game_id: 0,
  bank_chips: 0,
  bots_state: {
    CPU0: {
      status: '',
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
  phase: 'waiting',
  player: {
    chips: 0,
    game_over: true,
    is_folded: false,
    is_dealer: false,
    stake: 0,
    hand: [],
  },
  round_number: 0,
  table_cards: [],
  waiting_for_player: false,
  showdown_results: null,

  status: 'idle',
};

export const startGameThunk = createAsyncThunk(
  'game/startGame',
  async (args: StartGameArgs, { dispatch, rejectWithValue }) => {
    const { playerName, customChips, cpuNum, bigBlind } = args;

    try {
      const response = await instance.post<InitReturn>('http://localhost:5000/api/game', {
        username: playerName,
        custom_chips: customChips,
        cpu_num: cpuNum,
        big_blind: bigBlind,
      });

      const gameId = response.data.game_id;
      dispatch(setGameId(gameId));

      const gameStateResponse = await instance.get<StartRoundReturn>(
        `http://localhost:5000/api/game/${gameId}/start-round`
      );
      const gameState = gameStateResponse.data['game_state'];

      dispatch(updateGameState(gameState));
    } catch (error) {
      console.error('Error starting game:', error);
      return rejectWithValue('Failed to start game');
    }
  }
);

export const playerActionThunk = createAsyncThunk(
  'game/action',
  async (args: PlayerActionArgs, { dispatch, rejectWithValue }) => {
    const { action, amount, gameId } = args;

    try {
      const response = await instance.post<ActionReturn>(`/api/game/${gameId}/action`, {
        action: action,
        amount: amount || null,
      });

      if (response.data.success === false) {
        return rejectWithValue('Backend returned false success');
      }

      dispatch(updateGameState(response.data.game_state));
    } catch (error) {
      console.error('Error processing action: ', error);

      return rejectWithValue('Failed to start action');
    }
  }
);

export const startNextRoundThunk = createAsyncThunk(
  'game/nextRound',
  async (gameId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await instance.get<ActionReturn>(`/api/game/${gameId}/start-round`);

      if (response.data.success === false) {
        return rejectWithValue('Backend returned false success');
      }

      dispatch(updateGameState(response.data.game_state));
    } catch (error) {
      console.error('Error processing action: ', error);

      return rejectWithValue('Failed to proceed with game');
    }
  }
);

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameId: (state, action: { payload: number; type: string }) => {
      state.game_id = action.payload;
    },
    updateGameState: (state, action) => {
      const currentGameId = state.game_id;
      Object.assign(state, action.payload);
      state.game_id = currentGameId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGameThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(startGameThunk.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(startGameThunk.rejected, (state) => {
        state.status = 'error';
        console.error('Failed to start game');
      });
  },
});

export const { setGameId, updateGameState } = gameSlice.actions;

export default gameSlice.reducer;
