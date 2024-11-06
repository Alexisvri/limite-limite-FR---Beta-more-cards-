export type GameState = 'menu' | 'playing' | 'voting' | 'winner' | 'gameOver';

export interface Card {
  id: string;
  text: string;
  type: 'common' | 'private';
  blankIndex?: number;
}

export interface Player {
  id: number;
  name: string;
  cards: Card[];
  score: number;
  wins: number;
  remainingShuffles: number;
}

export interface PlayedCardSet {
  playerId: number;
  cards: Card[];
}