import React, { useRef, useEffect } from 'react';
import './FishGame.css';

const FishGame = ({ gameState, onBallCollected, onBallSpawned }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const fishRef = useRef({ x: 400, y: 250, width: 80, height: 60 });
  const ballsRef = useRef([]);
  const lastBallSpawnRef = useRef(0);
  const mousePosRef = useRef({ x: 400, y: 250 });

  const ballColors = ['#2196F3', '#4CAF50', '#F44336'];
  const ballPoints = [10, 20, 30];
  const ballRadius = 20;
  const BALL_SPAWN_INTERVAL = 60; // frames

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState.isRunning && !gameState.isPaused) {
      startGameLoop();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isRunning, gameState.isPaused]);

  const startGameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw water background
      drawWaterBackground(ctx);

      // Update and draw fish
      updateFish();
      drawFish(ctx);

      // Update and draw balls
      updateBalls();
      drawBalls(ctx);

      // Spawn new balls
      lastBallSpawnRef.current++;
      if (lastBallSpawnRef.current >= BALL_SPAWN_INTERVAL) {
        spawnBall();
        lastBallSpawnRef.current = 0;
        onBallSpawned();
      }

      if (gameState.isRunning && !gameState.isPaused) {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();
  };

  const drawWaterBackground = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
    gradient.addColorStop(0, '#0a3d91');
    gradient.addColorStop(1, '#1e7bc0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);
  };

  const updateFish = () => {
    const fish = fishRef.current;
    const mouse = mousePosRef.current;

    // Calculate direction to mouse
    const dx = mouse.x - fish.x;
    const dy = mouse.y - fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Move fish toward mouse
    if (distance > 5) {
      fish.x += (dx / distance) * fish.speed;
      fish.y += (dy / distance) * fish.speed;
    }

    // Keep fish within bounds
    fish.x = Math.max(fish.width/2, Math.min(800 - fish.width/2, fish.x));
    fish.y = Math.max(fish.height/2, Math.min(500 - fish.height/2, fish.y));
  };

  const drawFish = (ctx) => {
    const fish = fishRef.current;
    
    ctx.save();
    ctx.translate(fish.x, fish.y);

    // Draw fish body
    ctx.fillStyle = fish.color || '#FF6B9D';
    ctx.beginPath();
    ctx.ellipse(0, 0, fish.width/2, fish.height/2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(fish.width/4, -fish.height/6, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(fish.width/4, -fish.height/6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const spawnBall = () => {
    const colorIndex = Math.random() < 0.1 ? 2 : Math.random() < 0.3 ? 1 : 0; // 10% red, 30% green, 60% blue
    
    const ball = {
      x: Math.random() * (750 - ballRadius * 2) + ballRadius,
      y: Math.random() * (450 - ballRadius * 2) + ballRadius,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      color: ballColors[colorIndex],
      colorIndex,
      radius: ballRadius
    };

    ballsRef.current.push(ball);
  };

  const updateBalls = () => {
    const fish = fishRef.current;
    
    for (let i = ballsRef.current.length - 1; i >= 0; i--) {
      const ball = ballsRef.current[i];

      // Update position
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Bounce off walls
      if (ball.x <= ball.radius || ball.x >= 800 - ball.radius) {
        ball.vx = -ball.vx;
      }
      if (ball.y <= ball.radius || ball.y >= 500 - ball.radius) {
        ball.vy = -ball.vy;
      }

      // Check collision with fish
      const dx = ball.x - fish.x;
      const dy = ball.y - fish.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.radius + fish.width/2) {
        // Collision detected
        onBallCollected(
          ball.colorIndex === 2 ? 'red' : 
          ball.colorIndex === 1 ? 'green' : 'blue',
          ballPoints[ball.colorIndex]
        );

        // Remove ball
        ballsRef.current.splice(i, 1);
      }
    }
  };

  const drawBalls = (ctx) => {
    ballsRef.current.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      
      // Add highlight
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius/3, ball.y - ball.radius/3, ball.radius/4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    });
  };

  return (
    <div className="fish-game">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="game-canvas"
      />
    </div>
  );
};

export default FishGame;