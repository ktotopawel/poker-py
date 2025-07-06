export interface PlayerState {
  chips: number;
  game_over: boolean;
  is_dealer: boolean;
  is_folded: boolean;
  stake: number;
}

export interface CPUState extends PlayerState {
  status: "call" | "fold" | "check" | "raise" | "";
}

export type GamePhases =
  | "waiting"
  | "complete"
  | "preflop"
  | "flop"
  | "turn"
  | "river"
  | "showdown"
  | "complete";
