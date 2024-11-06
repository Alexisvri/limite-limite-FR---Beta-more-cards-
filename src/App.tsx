import React, { useState, useEffect } from 'react';
import { Shuffle, ThumbsUp, Users, Trophy } from 'lucide-react';
import GameBoard from './components/GameBoard';
import PlayerHand from './components/PlayerHand';
import VotingPhase from './components/VotingPhase';
import StartMenu from './components/StartMenu';
import PrivacyScreen from './components/PrivacyScreen';
import WinnerScreen from './components/WinnerScreen';
import VictoryScreen from './components/VictoryScreen';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const {
    gameState,
    setGameState,
    currentCommonCard,
    players,
    playedSets,
    currentPlayer,
    votingPlayer,
    votes,
    winTarget,
    LIKES_FOR_TROPHY,
    handleShuffleCards,
    playCards,
    handleVote,
    startGame,
    roundWinner,
    gameWinner
  } = useGameState();

  const [showPrivacyScreen, setShowPrivacyScreen] = useState(true);

  useEffect(() => {
    if (gameState === 'menu') {
      setShowPrivacyScreen(true);
    }
  }, [gameState]);

  const getBlankCount = (text: string) => {
    return (text.match(/_____/g) || []).length;
  };

  if (gameState === 'menu') {
    return <StartMenu players={players} onStartGame={startGame} />;
  }

  if (gameState === 'gameOver' && gameWinner) {
    return (
      <VictoryScreen
        winner={gameWinner}
        winTarget={winTarget}
        onReturnToMenu={() => setGameState('menu')}
      />
    );
  }

  const currentPlayerData = players.find(p => p.id === currentPlayer);
  const requiredCards = currentCommonCard ? getBlankCount(currentCommonCard.text) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
      {gameState === 'playing' && showPrivacyScreen && currentPlayerData && (
        <PrivacyScreen
          playerName={currentPlayerData.name}
          onReveal={() => setShowPrivacyScreen(false)}
        />
      )}
      
      {gameState === 'winner' && roundWinner && (
        <WinnerScreen
          winner={roundWinner}
          winTarget={winTarget}
          onComplete={() => setGameState('playing')}
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Limite Limite</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span>{winTarget} trophées pour gagner</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              <span>{LIKES_FOR_TROPHY} likes = 1 trophée</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{players.length} Joueurs</span>
            </div>
            <button 
              onClick={() => setGameState('menu')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Shuffle className="h-5 w-5" />
              Nouvelle Partie
            </button>
          </div>
        </header>

        <GameBoard 
          commonCard={currentCommonCard}
          playedCards={playedSets}
          gameState={gameState}
          currentPlayer={currentPlayer}
          onShuffleCards={handleShuffleCards}
          players={players}
        />

        {gameState === 'voting' ? (
          <VotingPhase 
            playedSets={playedSets}
            commonCard={currentCommonCard}
            onVote={handleVote}
            players={players}
            votingPlayer={votingPlayer}
            votes={votes}
          />
        ) : currentPlayerData && !showPrivacyScreen && (
          <PlayerHand
            player={currentPlayerData}
            onPlayCard={(playerId, cards) => {
              playCards(playerId, cards);
              setShowPrivacyScreen(true);
            }}
            disabled={gameState !== 'playing'}
            requiredCards={requiredCards}
          />
        )}

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.map(player => (
            <div 
              key={player.id}
              className={`p-4 rounded-lg backdrop-blur-sm ${
                (gameState === 'playing' && currentPlayer === player.id) || 
                (gameState === 'voting' && votingPlayer === player.id)
                  ? 'bg-indigo-700'
                  : 'bg-indigo-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{player.name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{player.score}/{LIKES_FOR_TROPHY}</span>
                  </div>
                  {player.wins > 0 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Trophy className="h-4 w-4" />
                      <span>{player.wins}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}