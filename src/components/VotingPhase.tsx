import React, { useEffect } from 'react';
import { Card, PlayedCardSet, Player } from '../types';
import { ThumbsUp, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface VotingPhaseProps {
  playedSets: PlayedCardSet[];
  commonCard: Card | null;
  onVote: (voterId: number, votedForId: number) => void;
  players: Player[];
  votingPlayer: number;
  votes: { voterId: number; votedForId: number }[];
}

const VotingPhase: React.FC<VotingPhaseProps> = ({ 
  playedSets, 
  commonCard, 
  onVote, 
  players,
  votingPlayer,
  votes
}) => {
  useEffect(() => {
    const audio = new Audio('/sound/vote screen.wav');
    audio.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
  }, []);

  const replaceBlankWithCards = (text: string, cards: Card[]) => {
    let result = text;
    cards.forEach((card) => {
      result = result.replace('_____', `[${card.text}]`);
    });
    return result;
  };

  const generateUniqueKey = (playedSet: PlayedCardSet) => {
    const cardsKey = playedSet.cards.map(card => card.id).join('-');
    return `${playedSet.playerId}-${cardsKey}`;
  };

  const currentVotingPlayer = players.find(p => p.id === votingPlayer);
  const hasVoted = (setPlayerId: number) => votes.some(v => v.voterId === votingPlayer && v.votedForId === setPlayerId);
  const getVoteCount = (playerId: number) => votes.filter(v => v.votedForId === playerId).length;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Phase de Vote</h2>
        {currentVotingPlayer && (
          <div className="text-indigo-300">
            C'est au tour de {currentVotingPlayer.name} de voter
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {playedSets.map((playedSet) => {
          const voteCount = getVoteCount(playedSet.playerId);
          const canVote = !hasVoted(playedSet.playerId);
          
          return (
            <motion.div
              key={generateUniqueKey(playedSet)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/10 p-6 rounded-lg transition-colors ${
                canVote ? 'hover:bg-white/20 cursor-pointer' : 'opacity-80'
              }`}
              onClick={() => canVote && onVote(votingPlayer, playedSet.playerId)}
            >
              {commonCard && (
                <p className="text-lg mb-2">
                  {replaceBlankWithCards(commonCard.text, playedSet.cards)}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {voteCount > 0 && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Crown className="h-4 w-4" />
                      <span>{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                {canVote && (
                  <div className="flex items-center gap-2 text-indigo-300">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">Voter pour cette réponse</span>
                  </div>
                )}
                {hasVoted(playedSet.playerId) && (
                  <div className="text-indigo-300 text-sm">Vous avez voté pour cette réponse</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VotingPhase;