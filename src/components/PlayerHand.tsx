import React, { useState } from 'react';
import { Card, Player } from '../types';
import { Check, X } from 'lucide-react';

interface PlayerHandProps {
  player: Player;
  onPlayCard: (playerId: number, selectedCards: Card[]) => void;
  disabled: boolean;
  requiredCards: number;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player, onPlayCard, disabled, requiredCards }) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const toggleCard = (card: Card) => {
    if (disabled) return;

    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < requiredCards) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = () => {
    if (selectedCards.length === requiredCards) {
      onPlayCard(player.id, selectedCards);
      setSelectedCards([]);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Main de {player.name}</h2>
        <div className="text-sm text-indigo-300">
          Sélectionnez {requiredCards} carte{requiredCards > 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {player.cards.map((card, index) => {
          const isSelected = selectedCards.some(c => c.id === card.id);
          return (
            <div
              key={`${card.id}-${index}`}
              className={`p-4 rounded-lg cursor-pointer transition-all relative ${
                isSelected ? 'bg-indigo-600' : 'bg-white/10 hover:bg-white/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => toggleCard(card)}
            >
              <p className="text-lg">{card.text}</p>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedCards.length !== requiredCards || disabled}
          className={`px-6 py-2 rounded-lg transition-colors ${
            selectedCards.length === requiredCards && !disabled
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          Jouer {selectedCards.length}/{requiredCards} carte{requiredCards > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default PlayerHand;