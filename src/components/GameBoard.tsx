import React from 'react';
import { Card, PlayedCardSet, GameState, Player } from '../types';
import { Shuffle } from 'lucide-react';

interface GameBoardProps {
  commonCard: Card | null;
  playedCards: PlayedCardSet[];
  gameState: GameState;
  currentPlayer: number;
  onShuffleCards: (playerId: number) => void;
  players: Player[];
}

export default function GameBoard({ 
  commonCard, 
  playedCards, 
  gameState,
  currentPlayer,
  onShuffleCards,
  players 
}: GameBoardProps) {
  const currentPlayerData = players.find(p => p.id === currentPlayer);

  return (
    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Carte Commune</h2>
        {gameState === 'playing' && currentPlayerData && (
          <button
            onClick={() => onShuffleCards(currentPlayer)}
            disabled={currentPlayerData.remainingShuffles <= 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPlayerData.remainingShuffles > 0
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            <Shuffle className="h-4 w-4" />
            Mélanger ({currentPlayerData.remainingShuffles} restant{currentPlayerData.remainingShuffles !== 1 ? 's' : ''})
          </button>
        )}
      </div>
      {commonCard && (
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-lg">{commonCard.text}</p>
        </div>
      )}
      
      {gameState === 'playing' && currentPlayerData && (
        <div className="mt-4 text-center text-indigo-300">
          C'est au tour de {currentPlayerData.name}
        </div>
      )}
    </div>
  );
}