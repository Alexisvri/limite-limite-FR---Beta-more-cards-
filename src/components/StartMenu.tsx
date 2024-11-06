import React, { useState } from 'react';
import { Player } from '../types';
import { Plus, Minus, Play, HelpCircle } from 'lucide-react';

interface StartMenuProps {
  players: Player[];
  onStartGame: (players: Player[], winTarget: number) => void;
}

export default function StartMenu({ players: initialPlayers, onStartGame }: StartMenuProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [winTarget, setWinTarget] = useState(5);
  const [showHelp, setShowHelp] = useState(false);

  const handleAddPlayer = () => {
    const newId = Math.max(...players.map(p => p.id)) + 1;
    setPlayers([...players, { 
      id: newId, 
      name: `Joueur ${newId}`, 
      cards: [], 
      score: 0, 
      wins: 0, 
      remainingShuffles: 3 
    }]);
  };

  const handleRemovePlayer = (id: number) => {
    if (players.length > 2) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const handleNameChange = (id: number, newName: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleStartGame = () => {
    onStartGame(players, winTarget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-lg max-w-md w-full backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Limite Limite</h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Comment jouer ?"
          >
            <HelpCircle className="h-6 w-6" />
          </button>
        </div>

        {showHelp && (
          <div className="mb-8 p-4 bg-white/5 rounded-lg">
            <h2 className="font-bold text-xl mb-3">Comment jouer ?</h2>
            <ul className="space-y-2 text-sm">
              <li>• Chaque joueur reçoit 7 cartes réponses</li>
              <li>• Une carte phrase avec des blancs (_____) est révélée</li>
              <li>• Les joueurs complètent la phrase avec leurs cartes</li>
              <li>• Votez pour la meilleure combinaison</li>
              <li>• 5 points = 1 trophée</li>
              <li>• Premier à atteindre le nombre de trophées défini gagne</li>
            </ul>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Trophée/s pour gagner</label>
          <input
            type="number"
            min="1"
            value={winTarget}
            onChange={(e) => setWinTarget(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-4 mb-6">
          {players.map(player => (
            <div key={player.id} className="flex items-center gap-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                placeholder="Nom du joueur"
                className="flex-1 px-3 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleRemovePlayer(player.id)}
                disabled={players.length <= 2}
                title="Supprimer le joueur"
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleAddPlayer}
            className="w-full px-4 py-2 bg-indigo-600/50 hover:bg-indigo-600/70 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Ajouter un joueur
          </button>

          <button
            onClick={handleStartGame}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="h-5 w-5" />
            Commencer la partie
          </button>
        </div>
      </div>
    </div>
  );
}