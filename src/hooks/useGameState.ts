import { useState, useCallback } from 'react';
import { Card, GameState, Player, PlayedCardSet } from '../types';
import { commonCards, privateCards } from '../data/cards';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentCommonCard, setCurrentCommonCard] = useState<Card | null>(null);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Joueur 1', cards: [], score: 0, wins: 0, remainingShuffles: 3 },
    { id: 2, name: 'Joueur 2', cards: [], score: 0, wins: 0, remainingShuffles: 3 },
  ]);
  const [playedSets, setPlayedSets] = useState<PlayedCardSet[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winTarget, setWinTarget] = useState<number>(5);
  const [availablePrivateCards, setAvailablePrivateCards] = useState<Card[]>([]);
  const [votes, setVotes] = useState<{ voterId: number; votedForId: number }[]>([]);
  const [votingPlayer, setVotingPlayer] = useState<number>(1);
  const [roundWinner, setRoundWinner] = useState<Player | null>(null);
  const [gameWinner, setGameWinner] = useState<Player | null>(null);

  const LIKES_FOR_TROPHY = 5;
  const CARDS_IN_HAND = 7;
  const MAX_SHUFFLES = 3;

  const shuffleCards = useCallback(() => {
    return [...privateCards].sort(() => Math.random() - 0.5);
  }, []);

  const dealCards = useCallback((gamePlayers: Player[]) => {
    const shuffledCards = shuffleCards();
    const newPlayers = gamePlayers.map(player => ({
      ...player,
      cards: shuffledCards.splice(0, CARDS_IN_HAND),
      score: 0,
      remainingShuffles: MAX_SHUFFLES
    }));
    
    setAvailablePrivateCards(shuffledCards);
    
    const shuffledCommonCards = [...commonCards].sort(() => Math.random() - 0.5);
    setCurrentCommonCard(shuffledCommonCards[0]);
    setPlayers(newPlayers);
    setPlayedSets([]);
    setVotes([]);
    setGameState('playing');
  }, [shuffleCards]);

  const drawCards = useCallback((count: number) => {
    let cards: Card[] = [];
    if (availablePrivateCards.length < count) {
      const newDeck = shuffleCards();
      setAvailablePrivateCards(newDeck);
      cards = newDeck.slice(0, count);
      setAvailablePrivateCards(newDeck.slice(count));
    } else {
      cards = availablePrivateCards.slice(0, count);
      setAvailablePrivateCards(availablePrivateCards.slice(count));
    }
    return cards;
  }, [availablePrivateCards, shuffleCards]);

  const handleShuffleCards = useCallback((playerId: number) => {
    setPlayers(currentPlayers => {
      const playerIndex = currentPlayers.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return currentPlayers;

      const player = currentPlayers[playerIndex];
      if (player.remainingShuffles <= 0) return currentPlayers;

      const newPlayers = [...currentPlayers];
      const updatedPlayer = { ...player };
      
      setAvailablePrivateCards(prev => [...prev, ...updatedPlayer.cards]);
      updatedPlayer.cards = drawCards(CARDS_IN_HAND);
      updatedPlayer.remainingShuffles = player.remainingShuffles - 1;
      
      newPlayers[playerIndex] = updatedPlayer;
      return newPlayers;
    });
  }, [drawCards]);

  const playCards = useCallback((playerId: number, selectedCards: Card[]) => {
    setPlayedSets(prev => [...prev, {
      playerId,
      cards: selectedCards.map((card, index) => ({ ...card, blankIndex: index }))
    }]);

    setPlayers(currentPlayers => {
      const playerIndex = currentPlayers.findIndex(p => p.id === playerId);
      const newPlayers = [...currentPlayers];
      const player = newPlayers[playerIndex];

      const remainingCards = player.cards.filter(c => !selectedCards.some(sc => sc.id === c.id));
      const cardsNeeded = CARDS_IN_HAND - remainingCards.length;
      const newCards = cardsNeeded > 0 ? drawCards(cardsNeeded) : [];
      
      player.cards = [...remainingCards, ...newCards];

      return newPlayers;
    });

    const findNextPlayer = (currentId: number): number => {
      let nextId = currentId % players.length + 1;
      while (playedSets.some(set => set.playerId === nextId)) {
        nextId = nextId % players.length + 1;
        if (nextId === currentId) break;
      }
      return nextId;
    };

    const nextPlayer = findNextPlayer(playerId);
    setCurrentPlayer(nextPlayer);

    if (playedSets.length + 1 === players.length) {
      setGameState('voting');
      setVotingPlayer(1);
      setVotes([]);
    }
  }, [players.length, playedSets, drawCards]);

  const handleVote = useCallback((voterId: number, votedForId: number) => {
    setVotes(prev => [...prev, { voterId, votedForId }]);
    
    const nextVotingPlayer = voterId % players.length + 1;
    
    if (votes.length + 1 === players.length) {
      const voteCount = new Map<number, number>();
      [...votes, { voterId, votedForId }].forEach(vote => {
        voteCount.set(vote.votedForId, (voteCount.get(vote.votedForId) || 0) + 1);
      });

      let maxVotes = 0;
      voteCount.forEach((count) => {
        if (count > maxVotes) maxVotes = count;
      });

      const winners = Array.from(voteCount.entries())
        .filter(([_, count]) => count === maxVotes)
        .map(([playerId]) => playerId);

      for (let i = winners.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [winners[i], winners[j]] = [winners[j], winners[i]];
      }

      const winnerId = winners[0];

      setPlayers(currentPlayers => {
        const newPlayers = currentPlayers.map(player => {
          if (player.id === winnerId) {
            const newScore = player.score + 1;
            if (newScore >= LIKES_FOR_TROPHY) {
              const newWins = player.wins + 1;
              if (newWins >= winTarget) {
                const winner = { ...player, score: 0, wins: newWins };
                setGameWinner(winner);
                setGameState('gameOver');
                return winner;
              }
              return { ...player, score: 0, wins: newWins };
            }
            return { ...player, score: newScore };
          }
          return player;
        });

        const winner = newPlayers.find(p => p.id === winnerId);
        if (winner) {
          setRoundWinner(winner);
        }

        return newPlayers;
      });

      setPlayedSets([]);
      if (gameState !== 'gameOver') {
        setGameState('winner');
      }
      setCurrentCommonCard(commonCards[Math.floor(Math.random() * commonCards.length)]);
      setCurrentPlayer(1);
      setVotes([]);
    } else {
      setVotingPlayer(nextVotingPlayer);
    }
  }, [players.length, votes, winTarget, gameState]);

  const startGame = useCallback((updatedPlayers: Player[], newWinTarget: number) => {
    const resetPlayers = updatedPlayers.map(player => ({
      ...player,
      wins: 0,
      score: 0,
      cards: [],
      remainingShuffles: MAX_SHUFFLES
    }));

    setWinTarget(newWinTarget);
    setCurrentPlayer(1);
    setVotingPlayer(1);
    setVotes([]);
    setRoundWinner(null);
    setGameWinner(null);
    dealCards(resetPlayers);
  }, [dealCards]);

  return {
    gameState,
    setGameState,
    currentCommonCard,
    players,
    setPlayers,
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
  };
}