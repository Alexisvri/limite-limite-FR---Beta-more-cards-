import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home } from 'lucide-react';
import { Player } from '../types';

interface VictoryScreenProps {
  winner: Player;
  winTarget: number;
  onReturnToMenu: () => void;
}

export default function VictoryScreen({ winner, winTarget, onReturnToMenu }: VictoryScreenProps) {
  useEffect(() => {
    const audio = new Audio('/sound/epic win.wav');
    audio.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-lg mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block mb-8"
        >
          <Trophy className="h-32 w-32 text-yellow-400" />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text">
            {winner.name} remporte la partie !
          </h2>
          
          <p className="text-2xl text-indigo-200">
            Avec {winTarget} trophées, une victoire écrasante !
          </p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onReturnToMenu}
            className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xl font-medium transition-colors inline-flex items-center gap-3"
          >
            <Home className="h-6 w-6" />
            Retour au menu
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}