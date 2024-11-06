import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Player } from '../types';

interface WinnerScreenProps {
  winner: Player;
  winTarget: number;
  onComplete: () => void;
}

export default function WinnerScreen({ winner, winTarget, onComplete }: WinnerScreenProps) {
  useEffect(() => {
    const audio = new Audio('/sound/win.wav');
    audio.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
    
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <Trophy className="h-24 w-24 text-yellow-400" />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-4"
        >
          {winner.name} remporte la manche !
        </motion.h2>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-indigo-200"
        >
          Trophées: {winner.wins} / {winTarget}
        </motion.div>
      </motion.div>
    </div>
  );
}