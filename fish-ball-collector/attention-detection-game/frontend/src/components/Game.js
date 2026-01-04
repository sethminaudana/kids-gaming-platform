import React, { useState, useEffect, useRef } from 'react';
import FishGame from './FishGame';
import GameMetrics from './GameMetrics';
import './Game.css';

const Game = ({ onGameUpdate, sessionId }) => {
  const [gameState, setGameState] = useState({
    score: 0,
    ballsCollected: 0,
    redBallsTouched: 0,
    gameTime: 0,
    reactionTimes: [],
    accuracy: 0,
    isRunning: false,
    isPaused: false,
    gameStarted: false
  });

  const gameTimer = useRef(null);
  const reactionTimer = useRef(null);
  const gameStartTime = useRef(null);
  const lastBallSpawnTime = useRef(null);

  // Start game timer
  useEffect(() => {
    if (gameState.isRunning && !gameState.isPaused) {
      gameTimer.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          gameTime: prev.gameTime + 1
        }));
      }, 1000);
    } else {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
      }
    }

    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
      }
    };
  }, [gameState.isRunning, gameState.isPaused]);

  // Send game updates to parent
  useEffect(() => {
    if (gameState.gameStarted) {
      const gameData = {
        sessionId,
        timestamp: Date.now(),
        gameState: { ...gameState },
        reactionTime: gameState.reactionTimes.length > 0 
          ? gameState.reactionTimes.reduce((a, b) => a + b, 0) / gameState.reactionTimes.length
          : 0,
        performanceMetrics: calculatePerformanceMetrics()
      };

      onGameUpdate(gameData);
    }
  }, [gameState.score, gameState.ballsCollected, gameState.redBallsTouched, gameState.gameTime]);

  const calculatePerformanceMetrics = () => {
    const totalBalls = gameState.ballsCollected + gameState.redBallsTouched;
    const accuracy = totalBalls > 0 
      ? (gameState.ballsCollected / totalBalls) * 100 
      : 0;
    
    const avgReactionTime = gameState.reactionTimes.length > 0
      ? gameState.reactionTimes.reduce((a, b) => a + b, 0) / gameState.reactionTimes.length
      : 0;
    
    const scorePerSecond = gameState.gameTime > 0
      ? gameState.score / gameState.gameTime
      : 0;

    return {
      accuracy,
      avgReactionTime,
      scorePerSecond,
      efficiency: (gameState.score / (gameState.gameTime || 1)) * (accuracy / 100)
    };
  };

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      isRunning: true,
      gameStarted: true,
      score: 0,
      ballsCollected: 0,
      redBallsTouched: 0,
      gameTime: 0,
      reactionTimes: []
    }));
    gameStartTime.current = Date.now();
    lastBallSpawnTime.current = Date.now();
  };

  const handlePauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const handleRestartGame = () => {
    setGameState({
      score: 0,
      ballsCollected: 0,
      redBallsTouched: 0,
      gameTime: 0,
      reactionTimes: [],
      accuracy: 0,
      isRunning: true,
      isPaused: false,
      gameStarted: true
    });
    gameStartTime.current = Date.now();
    lastBallSpawnTime.current = Date.now();
  };

  const handleBallCollected = (ballType, points) => {
    const reactionTime = lastBallSpawnTime.current 
      ? Date.now() - lastBallSpawnTime.current
      : 0;

    setGameState(prev => {
      const isRedBall = ballType === 'red';
      const newRedBallsTouched = isRedBall ? prev.redBallsTouched + 1 : prev.redBallsTouched;
      const newReactionTimes = [...prev.reactionTimes, reactionTime];

      // Game over after 3 red balls
      if (newRedBallsTouched >= 3) {
        return {
          ...prev,
          redBallsTouched: newRedBallsTouched,
          reactionTimes: newReactionTimes,
          isRunning: false
        };
      }

      return {
        ...prev,
        score: prev.score + points,
        ballsCollected: isRedBall ? prev.ballsCollected : prev.ballsCollected + 1,
        redBallsTouched: newRedBallsTouched,
        reactionTimes: newReactionTimes
      };
    });

    lastBallSpawnTime.current = Date.now();
  };

  const handleBallSpawned = () => {
    lastBallSpawnTime.current = Date.now();
  };

  return (
    <div className="game-container">
      <h2>Fish Ball Collector</h2>
      
      <div className="game-wrapper">
        <FishGame
          gameState={gameState}
          onBallCollected={handleBallCollected}
          onBallSpawned={handleBallSpawned}
        />
        
        <GameMetrics gameState={gameState} />
        
        <div className="game-controls">
          {!gameState.gameStarted || !gameState.isRunning ? (
            <button onClick={handleStartGame} className="start-btn">
              Start Game
            </button>
          ) : (
            <button onClick={handlePauseGame} className="pause-btn">
              {gameState.isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          
          <button onClick={handleRestartGame} className="restart-btn">
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;