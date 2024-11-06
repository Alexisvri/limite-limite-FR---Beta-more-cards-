import React, { useEffect } from 'react';
import { Eye } from 'lucide-react';

interface PrivacyScreenProps {
  playerName: string;
  onReveal: () => void;
}

export default function PrivacyScreen({ playerName, onReveal }: PrivacyScreenProps) {
  useEffect(() => {
    const audio = new Audio('/sound/change player.wav');
    audio.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center max-w-lg mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Tour de {playerName}</h2>
        <p className="text-xl mb-8 text-indigo-200">
          Les autres joueurs, fermez vos yeux pendant que {playerName} joue son tour.
        </p>
        <button
          onClick={onReveal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-medium transition-colors mx-auto"
        >
          <Eye className="h-6 w-6" />
          Voir mes cartes
        </button>
      </div>
    </div>
  );
}