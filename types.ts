
export enum CoinSide {
  HEADS = 'Heads',
  TAILS = 'Tails',
}

export type DiceRollBetType = 'under' | 'exact' | 'over';
export type CardBetType = 'higher' | 'lower';

export interface User {
  username: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}
