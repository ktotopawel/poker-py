import type { AppDispatch } from '../store/store.ts';
import { playerActionThunk, startNextRoundThunk } from '../store/slices/gameState.slice.ts';

class PlayerActionsController {
  dispatch: AppDispatch;
  gameId: number;

  constructor(dispatch: AppDispatch, gameId: number) {
    this.dispatch = dispatch;
    this.gameId = gameId;
  }

  fold() {
    this.dispatch(playerActionThunk({ gameId: this.gameId, action: 'fold' })).catch((err) => {
      console.error(err);
    });
  }

  call(amount: number) {
    this.dispatch(playerActionThunk({ gameId: this.gameId, action: 'call', amount: amount })).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  raise(amount: number) {
    this.dispatch(
      playerActionThunk({ gameId: this.gameId, action: 'raise', amount: amount })
    ).catch((err) => {
      console.error(err);
    });
  }

  nextRound() {
    this.dispatch(startNextRoundThunk(this.gameId)).catch((err) => {
      console.error(err);
    });
  }
}

export default PlayerActionsController;
