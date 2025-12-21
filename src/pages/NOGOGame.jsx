import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [language, setLanguage] = useState('sinhala');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Ref to track if game is active to avoid state update issues
  const gameActiveRef = useRef(gameActive);
  const timeLeftRef = useRef(timeLeft);

  // Update refs when state changes
  useEffect(() => {
    gameActiveRef.current = gameActive;
    timeLeftRef.current = timeLeft;
  }, [gameActive, timeLeft]);

  // Language translations
  const translations = {
    sinhala: {
      title: 'NO GO ක්‍රීඩාව',
      subtitle: 'ඔබේ අවධානය සහ පාලනය පරීක්ෂා කරන්න!',
      rules: '🕹️ රීති:',
      greenBlock: 'කොළ බ්ලොක් = ',
      redBlock: 'රතු බ්ලොක් = ',
      tip1: 'වේගයත් එක්ක හරි පිළිතුරු දෙන්න!',
      tip2: 'වැඩි ලකුණු සඳහා ඉහළ මට්ටම් වලට යන්න!',
      score: 'ලකුණු: ',
      level: 'මට්ටම: ',
      highScore: 'ඉහළම ලකුණු: ',
      time: 'කාලය: ',
      gameOver: 'ක්‍රීඩාව අවසන්! ඔබේ ලකුණු: ',
      levelUp2: 'මට්ටම 2! නව බ්ලොක් එකතු විය!',
      levelUp3: 'මට්ටම 3! දුෂ්කර බ්ලොක් එකතු විය!',
      correct: 'හරි! +',
      wrong: 'වැරදියි! ලකුණු නැත',
      points: ' ලකුණු',
      startGame: '🎮 ක්‍රීඩාව ආරම්භ කරන්න',
      goButton: '✅ GO',
      noGoButton: '❌ NO GO',
      backButton: '← නිවසට ආපසු',
      languages: {
        sinhala: 'සිංහල',
        english: 'English',
        tamil: 'தமிழ்'
      }
    },
    english: {
      title: 'NO GO Game',
      subtitle: 'Test your attention and control!',
      rules: '🕹️ Rules:',
      greenBlock: 'Green Block = ',
      redBlock: 'Red Block = ',
      tip1: 'Give correct answers quickly!',
      tip2: 'Go to higher levels for more points!',
      score: 'Score: ',
      level: 'Level: ',
      highScore: 'High Score: ',
      time: 'Time: ',
      gameOver: 'Game Over! Your score: ',
      levelUp2: 'Level 2! New blocks added!',
      levelUp3: 'Level 3! Difficult blocks added!',
      correct: 'Correct! +',
      wrong: 'Wrong! No points',
      points: ' points',
      startGame: '🎮 Start Game',
      goButton: '✅ GO',
      noGoButton: '❌ NO GO',
      backButton: '← Back to Home',
      languages: {
        sinhala: 'සිංහල',
        english: 'English',
        tamil: 'தமிழ்'
      }
    },
    tamil: {
      title: 'NO GO விளையாட்டு',
      subtitle: 'உங்கள் கவனத்தையும் கட்டுப்பாட்டையும் சோதிக்கவும்!',
      rules: '🕹️ விதிகள்:',
      greenBlock: 'பச்சை தொகுதி = ',
      redBlock: 'சிவப்பு தொகுதி = ',
      tip1: 'விரைவாக சரியான பதில்களை கொடுங்கள்!',
      tip2: 'அதிக புள்ளிகளுக்கு உயர் நிலைகளுக்கு செல்லவும்!',
      score: 'புள்ளிகள்: ',
      level: 'நிலை: ',
      highScore: 'அதிக புள்ளிகள்: ',
      time: 'நேரம்: ',
      gameOver: 'விளையாட்டு முடிந்தது! உங்கள் புள்ளிகள்: ',
      levelUp2: 'நிலை 2! புதிய தொகுதிகள் சேர்க்கப்பட்டன!',
      levelUp3: 'நிலை 3! கடினமான தொகுதிகள் சேர்க்கப்பட்டன!',
      correct: 'சரி! +',
      wrong: 'தவறு! புள்ளிகள் இல்லை',
      points: ' புள்ளிகள்',
      startGame: '🎮 விளையாட்டை தொடங்கு',
      goButton: '✅ GO',
      noGoButton: '❌ NO GO',
      backButton: '← வீட்டிற்கு திரும்பு',
      languages: {
        sinhala: 'සිංහල',
        english: 'English',
        tamil: 'தமிழ்'
      }
    }
  };

  const t = translations[language];

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
    if (!gameActiveRef.current) return;
    
    let availableBlocks = blockTypes;
    
    if (level === 1) {
      availableBlocks = blockTypes.slice(0, 4);
    } else if (level === 2) {
      availableBlocks = blockTypes.slice(0, 6);
    }
    
    const randomBlock = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
    setCurrentBlock(randomBlock);
    setGameMessage('');
    setIsProcessing(false); // Reset processing state
  }, [blockTypes, level]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setLevel(1);
    setCurrentBlock(null);
    setGameMessage('');
    setIsProcessing(false);
    
    // Show first block immediately
    setTimeout(() => {
      let availableBlocks = blockTypes.slice(0, 4);
      const randomBlock = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
      setCurrentBlock(randomBlock);
    }, 100);
  };

  useEffect(() => {
    if (score >= 20 && level < 3) {
      setLevel(3);
      setGameMessage(t.levelUp3);
    } else if (score >= 10 && level < 2) {
      setLevel(2);
      setGameMessage(t.levelUp2);
    }
  }, [score, level, t]);

  const handleReaction = (userAction) => {
    if (!gameActive || !currentBlock || isProcessing) return;
    
    setIsProcessing(true);
    
    if (userAction === currentBlock.action) {
      const points = level === 1 ? 1 : level === 2 ? 2 : 3;
      setScore(prev => prev + points);
      setGameMessage(`${t.correct}${points}${t.points}`);
    } else {
      setGameMessage(t.wrong);
    }

    // Show new block after delay, but timer continues
    setTimeout(showNewBlock, 500);
  };

  // Timer effect - fixed to run independently
  useEffect(() => {
    let timerInterval;
    
    if (gameActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [gameActive, timeLeft]);

  // Check for game over when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      if (score > highScore) {
        setHighScore(score);
      }
      setGameMessage(`${t.gameOver} ${score}`);
    }
  }, [timeLeft, gameActive, score, highScore, t]);

  // Check for game over when gameActive changes
  useEffect(() => {
    if (!gameActive && timeLeft === 0) {
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameActive, timeLeft, score, highScore]);

  // Disable buttons when processing
  const buttonDisabled = !gameActive || isProcessing;

  return (
    <div className="nogo-game">
      <div className="game-header">
        <Link to="/" className="back-button">
          {t.backButton}
        </Link>
        <h1>{t.title}</h1>
        <div className="language-selector">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-dropdown"
            disabled={gameActive}
          >
            <option value="sinhala">{t.languages.sinhala}</option>
            <option value="english">{t.languages.english}</option>
            <option value="tamil">{t.languages.tamil}</option>
          </select>
        </div>
      </div>
      
      <p className="subtitle">{t.subtitle}</p>
      
      <div className="game-info">
        <div className="score">{t.score}{score}</div>
        <div className="level">{t.level}{level}</div>
        <div className="high-score">{t.highScore}{highScore}</div>
        <div className="timer">{t.time}{timeLeft}s</div>
      </div>

      {!gameActive ? (
        <div className="start-screen">
          <div className="instructions">
            <h3>{t.rules}</h3>
            <div className="rule">
              <div className="go-example">
                <div className="block square green small"></div>
                <span>{t.greenBlock}<strong>GO</strong></span>
              </div>
              <div className="nogo-example">
                <div className="block square red small"></div>
                <span>{t.redBlock}<strong>NO GO</strong></span>
              </div>
            </div>
            <p className="tip">{t.tip1}</p>
            <p className="tip">{t.tip2}</p>
          </div>
          <button onClick={startGame} className="start-button">
            {t.startGame}
          </button>
        </div>
      ) : (
        <div className="game-area">
          <div className="current-block-container">
            {currentBlock && (
              <div 
                className={`block ${currentBlock.shape} ${currentBlock.color} ${level > 1 ? 'pulse' : ''} ${isProcessing ? 'fade-out' : ''}`}
              >
                {level > 2 && <div className="sparkle"></div>}
              </div>
            )}
            {!currentBlock && (
              <div className="block-placeholder">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
          
          <div className={`message ${gameMessage.includes(t.correct.split('!')[0]) ? 'correct' : 'wrong'}`}>
            {gameMessage}
          </div>
          
          <div className="controls">
            <button 
              className={`go-button ${buttonDisabled ? 'disabled' : ''}`}
              onClick={() => handleReaction('GO')}
              disabled={buttonDisabled}
            >
              {t.goButton}
            </button>
            <button 
              className={`no-go-button ${buttonDisabled ? 'disabled' : ''}`}
              onClick={() => handleReaction('NO-GO')}
              disabled={buttonDisabled}
            >
              {t.noGoButton}
            </button>
          </div>
          
          {isProcessing && (
            <div className="processing-indicator">
              <div className="processing-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NOGOGame;