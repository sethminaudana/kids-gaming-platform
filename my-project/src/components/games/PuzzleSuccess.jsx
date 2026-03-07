// src/components/games/PuzzleSuccess.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Star, Sparkles, Medal, Award, Clock, RotateCcw } from 'lucide-react';

const PuzzleSuccess = ({ 
  difficulty, 
  onPlayAgain, 
  onNextLevel, 
  imageUrl,
  completionTime,
  tryAgainCount,
  formatTime
}) => {
  // Confetti effect
  useEffect(() => {
    const confettiCount = 50;
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
    `;
    document.body.appendChild(container);

    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#32CD32', '#1E90FF', '#FF1493'];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 2;
      const size = 5 + Math.random() * 10;
      
      confetti.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: -20px;
        width: ${size}px;
        height: ${size * 1.5}px;
        background: ${color};
        opacity: 0.8;
        transform: rotate(${Math.random() * 360}deg);
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${duration}s linear ${delay}s infinite;
      `;
      container.appendChild(confetti);
    }

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const messages = {
    easy: "Amazing work! Puzzle master! ⭐",
    medium: "Amazing work! Puzzle master! 🌟",
    hard: "Amazing work! Puzzle master! 👑"
  };

  const titles = {
    easy: "Congratulations!",
    medium: "Congratulations!",
    hard: "Congratulations!"
  };

  const prizes = {
    easy: "🐱",
    medium: "🐶",
    hard: "🐮"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
      >
        {/* Background sparkle effects */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl"
        />

        {/* Trophy Icon */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <Trophy className="w-20 h-20 text-yellow-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Congratulations Title */}
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-2"
        >
          {titles[difficulty]}
        </motion.h2>

        {/* Success Message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-purple-600 mb-6 font-semibold"
        >
          {messages[difficulty]}
        </motion.p>

        {/* Full Puzzle Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-300 mx-auto"
          style={{ maxWidth: '300px', margin: '0 auto' }}
        >
          <img 
            src={imageUrl} 
            alt="Completed Puzzle" 
            className="w-full h-auto object-cover"
          />
          
          {/* Success checkmark overlay */}
          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Stats Grid - Pieces, Time, Try Again */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* Pieces */}
          <div className="bg-purple-50 p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-600">
              {difficulty === 'easy' ? '4' : 
               difficulty === 'medium' ? '9' : '16'}
            </div>
            <div className="text-sm text-gray-600">Pieces</div>
          </div>

          {/* Time */}
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(completionTime || 0)}
            </div>
            <div className="text-sm text-gray-600">Time</div>
          </div>

          {/* Try Again */}
          <div className="bg-orange-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-orange-600">
              {tryAgainCount}
            </div>
            <div className="text-sm text-gray-600">Try Again</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-bold text-lg flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Play Again
          </motion.button>
          
          {difficulty !== 'hard' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-bold text-lg flex items-center justify-center shadow-lg"
            >
              <Award className="w-5 h-5 mr-2" />
              Next Level →
            </motion.button>
          )}
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-6 text-gray-500 text-sm"
        >
          {difficulty === 'easy' && `🎯 Great job! You took ${formatTime(completionTime || 0)} with ${tryAgainCount} tries!`}
          {difficulty === 'medium' && `🚀 Amazing! ${formatTime(completionTime || 0)} time and ${tryAgainCount} tries!`}
          {difficulty === 'hard' && `🏆 Champion! ${formatTime(completionTime || 0)} time and only ${tryAgainCount} tries!`}
        </motion.div>
      </motion.div>

      {/* CSS for confetti animation */}
      <style jsx global>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti-container {
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PuzzleSuccess;