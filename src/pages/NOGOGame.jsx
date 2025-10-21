import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './NOGOGame.css';

const NOGOGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);

  
  const blockTypes = [
    { shape: 'square', color: 'green', action: 'GO' },
    { shape: 'square', color: 'red', action: 'NO-GO' },
    { shape: 'circle', color: 'green', action: 'GO' },
    { shape: 'circle', color: 'red', action: 'NO-GO' },
    { shape: 'triangle', color: 'green', action: 'GO' },
    { shape: 'triangle', color: 'red', action: 'NO-GO' },
    { shape: 'diamond', color: 'green', action: 'GO' },
    { shape: 'diamond', color: 'red', action: 'NO-GO' },
  ];

 
  const showNewBlock = useCallback(() => {
    let availableBlocks = blockTypes;
    
  
    if (level === 1) {
      availableBlocks = blockTypes.slice(0, 4); 
    } else if (level === 2) {
      availableBlocks = blockTypes.slice(0, 6); 
    }
    
    
    const randomBlock = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
    setCurrentBlock(randomBlock);
    setGameMessage('');
  }, [blockTypes, level]);

 
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setLevel(1);
    showNewBlock();
  };

  
  useEffect(() => {
    if (score >= 20 && level < 3) {
      setLevel(3);
      setGameMessage('මට්ටම 3! දුෂ්කර බ්ලොක් එකතු විය!');
    } else if (score >= 10 && level < 2) {
      setLevel(2);
      setGameMessage('මට්ටම 2! නව බ්ලොක් එකතු විය!');
    }
  }, [score, level]);

 
  const handleReaction = (userAction) => {
    if (!gameActive || !currentBlock) return;

    if (userAction === currentBlock.action) {
      const points = level === 1 ? 1 : level === 2 ? 2 : 3;
      setScore(prev => prev + points);
      setGameMessage(`හරි! +${points} ලකුණු`);
    } else {
      setGameMessage('වැරදියි! ලකුණු නැත');
    }

   
    setTimeout(showNewBlock, 800);
  };

  
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) {
        setHighScore(score);
      }
      setGameMessage(`ක්‍රීඩාව අවසන්! ඔබේ ලකුණු: ${score}`);
    }
  }, [gameActive, timeLeft, score, highScore]);

  return (
    <div className="nogo-game">
      <div className="game-header">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <h1>NO GO Game</h1>
        <div style={{width: '100px'}}></div> {/* Spacer for alignment */}
      </div>
      
      <p className="subtitle">ඔබේ අවධානය සහ පාලනය පරීක්ෂා කරන්න!</p>
      
      <div className="game-info">
        <div className="score">ලකුණු: {score}</div>
        <div className="level">මට්ටම: {level}</div>
        <div className="high-score">ඉහළම ලකුණු: {highScore}</div>
        <div className="timer">කාලය: {timeLeft}s</div>
      </div>

      {!gameActive ? (
        <div className="start-screen">
          <div className="instructions">
            <h3>🕹️ රීති:</h3>
            <div className="rule">
              <div className="go-example">
                <div className="block square green small"></div>
                <span>කොළ බ්ලොක් = <strong>GO</strong></span>
              </div>
              <div className="nogo-example">
                <div className="block square red small"></div>
                <span>රතු බ්ලොක් = <strong>NO GO</strong></span>
              </div>
            </div>
            <p className="tip">වේගයත් එක්ක හරි පිළිතුරු දෙන්න!</p>
            <p className="tip">වැඩි ලකුණු සඳහා ඉහළ මට්ටම් වලට යන්න!</p>
          </div>
          <button onClick={startGame} className="start-button">
            🎮 ක්‍රීඩාව ආරම්භ කරන්න
          </button>
        </div>
      ) : (
        <div className="game-area">
          <div className="current-block-container">
            {currentBlock && (
              <div 
                className={`block ${currentBlock.shape} ${currentBlock.color} ${level > 1 ? 'pulse' : ''}`}
              >
                {level > 2 && <div className="sparkle"></div>}
              </div>
            )}
          </div>
          
          <div className={`message ${gameMessage.includes('හරි') ? 'correct' : 'wrong'}`}>
            {gameMessage}
          </div>
          
          <div className="controls">
            <button 
              className="go-button" 
              onClick={() => handleReaction('GO')}
            >
              ✅ GO
            </button>
            <button 
              className="no-go-button" 
              onClick={() => handleReaction('NO-GO')}
            >
              ❌ NO GO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NOGOGame;