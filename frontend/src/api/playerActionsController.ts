import instance from './axiosInstance.ts';
import type { ActionReturn } from '../types/apiTypes.ts';

class PlayerActionsController {
  static async checkAndCall(gameId: string, toCall: number) {
    const response = await instance.post<ActionReturn>(`/game/${gameId}/action`, {
      action: 'call',
      amount: toCall,
    });
    return response.data.game_state;
  }

  static async fold(gameId: string) {
    const response = await instance.post<ActionReturn>(`/game/${gameId}/action`, {
      action: 'fold',
    });
    return response.data.game_state;
  }

  static async raise(gameId: string, amount: number) {
    const response = await instance.post<ActionReturn>(`/game/${gameId}/action`, {
      action: 'raise',
      amount,
    });
    return response.data.game_state;
  }

  static async startNextRound(gameId: string) {
    const response = await instance.get<ActionReturn>(`/game/${gameId}/start-round`);
    return response.data.game_state;
  }
}

export default PlayerActionsController;
