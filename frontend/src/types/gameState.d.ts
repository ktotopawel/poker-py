export interface PlayerState {
  chips: number;
  game_over: boolean;
  is_dealer: boolean;
  is_folded: boolean;
  stake: number;
  hand?: string[];
}

export interface CPUState extends PlayerState {
  status: "call" | "fold" | "check" | "raise" | "";
}

export type GamePhases =
  | "waiting"
  | "preflop"
  | "flop"
  | "turn"
  | "river"
  | "showdown"
  | "complete";

export interface PlayerResults {
  name: string;
  hand: string[];
  score: number;
  hand_description: string;
  hand_strength: number;
  is_winner: boolean;
}
