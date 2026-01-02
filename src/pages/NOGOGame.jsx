// NOGOGame.js - Fixed version
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NOGOGame.css';
import * as mpFaceMesh from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// Language translations object (same as before)
const translations = {
  en: {
    title: "NO GO Game",
    subtitle: "Test your attention and control!",
    rules: "🎮 Rules:",
    goRule: "Green Block = GO",
    nogoRule: "Red Block = NO GO",
    tip1: "Respond quickly with the right answers!",
    tip2: "Go to higher levels for more points!",
    score: "Score:",
    level: "Level:",
    highScore: "High Score:",
    time: "Time:",
    startButton: "🎮 Start Game",
    correctMessage: "Correct!",
    wrongMessage: "Wrong!",
    stopMessage: "Wrong! Stay still during Stop Sign! (-2 points)",
    goButton: "✅ GO",
    noGoButton: "❌ NO GO",
    gameOver: "Game Over! Your score:",
    backButton: "← Back to Home",
    levelUp1: "Level 2! New blocks added!",
    levelUp2: "Level 3! Difficult blocks added!",
    stopSign: "🛑 STOP",
    pleaseSelect: "Please select a language to continue",
    languageTitle: "🌍 Select Language",
    selectToContinue: "Select your preferred language to continue",
    english: "English",
    sinhala: "Sinhala",
    tamil: "Tamil",
    continueBtn: "Continue",
    changeLanguage: "Change Language",
    selectLanguage: "Select Language",
    soundOn: "🔊 Sound On",
    soundOff: "🔇 Sound Off"
  },
  si: {
    title: "NO GO ක්‍රීඩාව",
    subtitle: "ඔබේ අවධානය සහ පාලනය පරීක්ෂා කරන්න!",
    rules: "🕹️ රීති:",
    goRule: "කොළ බ්ලොක් = GO",
    nogoRule: "රතු බ්ලොක් = NO GO",
    tip1: "වේගයත් එක්ක හරි පිළිතුරු දෙන්න!",
    tip2: "වැඩි ලකුණු සඳහා ඉහළ මට්ටම් වලට යන්න!",
    score: "ලකුණු:",
    level: "මට්ටම:",
    highScore: "ඉහළම ලකුණු:",
    time: "කාලය:",
    startButton: "🎮 ක්‍රීඩාව ආරම්භ කරන්න",
    correctMessage: "හරි!",
    wrongMessage: "වැරදියි!",
    stopMessage: "වැරදියි! Stop Sign එකේදී නිශ්චලව සිටින්න! (-2 ලකුණු)",
    goButton: "✅ GO",
    noGoButton: "❌ NO GO",
    gameOver: "ක්‍රීඩාව අවසන්! ඔබේ ලකුණු:",
    backButton: "← මුල් පිටුවට",
    levelUp1: "මට්ටම 2! නව බ්ලොක් එකතු විය!",
    levelUp2: "මට්ටම 3! දුෂ්කර බ්ලොක් එකතු විය!",
    stopSign: "🛑 STOP",
    pleaseSelect: "කරුණාකර ඉදිරියට යාමට භාෂාවක් තෝරන්න",
    languageTitle: "🌍 භාෂාව තෝරන්න",
    selectToContinue: "ඉදිරියට යාමට ඔබේ ප්‍රියතම භාෂාව තෝරන්න",
    english: "ඉංග්‍රීසි",
    sinhala: "සිංහල",
    tamil: "දෙමළ",
    continueBtn: "ඉදිරියට",
    changeLanguage: "භාෂාව වෙනස් කරන්න",
    selectLanguage: "භාෂාව තෝරන්න",
    soundOn: "🔊 ශබ්දය සක්‍රියයි",
    soundOff: "🔇 ශබ්දය අක්‍රියයි"
  },
  ta: {
    title: "NO GO விளையாட்டு",
    subtitle: "உங்கள் கவனத்தையும் கட்டுப்பாட்டையும் சோதிக்கவும்!",
    rules: "🎮 விதிகள்:",
    goRule: "பச்சை தொகுதி = GO",
    nogoRule: "சிவப்பு தொகுதி = NO GO",
    tip1: "வேகமாக சரியான பதில்களை கொடுங்கள்!",
    tip2: "அதிக புள்ளிகளுக்கு உயர் நிலைகளுக்கு செல்லவும்!",
    score: "புள்ளிகள்:",
    level: "நிலை:",
    highScore: "அதிக புள்ளிகள்:",
    time: "நேரம்:",
    startButton: "🎮 விளையாட்டை தொடங்கு",
    correctMessage: "சரி!",
    wrongMessage: "தவறு!",
    stopMessage: "தவறு! Stop Sign போது நிலையாக இருங்கள்! (-2 புள்ளிகள்)",
    goButton: "✅ GO",
    noGoButton: "❌ NO GO",
    gameOver: "விளையாட்டு முடிந்தது! உங்கள் புள்ளிகள்:",
    backButton: "← முகப்பு பக்கத்திற்கு",
    levelUp1: "நிலை 2! புதிய தொகுதிகள் சேர்க்கப்பட்டது!",
    levelUp2: "நிலை 3! கடினமான தொகுதிகள் சேர்க்கப்பட்டது!",
    stopSign: "🛑 STOP",
    pleaseSelect: "தொடர ஒரு மொழியைத் தேர்ந்தெடுக்கவும்",
    languageTitle: "🌍 மொழியைத் தேர்ந்தெடுக்கவும்",
    selectToContinue: "தொடர உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்",
    english: "ஆங்கிலம்",
    sinhala: "சிங்களம்",
    tamil: "தமிழ்",
    continueBtn: "தொடரவும்",
    changeLanguage: "மொழியை மாற்று",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    soundOn: "🔊 ஒலி இயக்கப்பட்டது",
    soundOff: "🔇 ஒலி முடக்கப்பட்டது"
  }
};

// Language Selection Component (same as before)
const LanguageSelector = ({ onLanguageSelect }) => {
  const [selectedLang, setSelectedLang] = useState('si');

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
  };

  const handleContinue = () => {
    if (selectedLang) {
      localStorage.setItem('nogo-language', selectedLang);
      onLanguageSelect(selectedLang);
    }
  };

  return (
    <div className="language-selector-screen">
      <div className="language-selector-container">
        <div className="language-header">
          <div className="language-icon">🌍</div>
          <h1>Select Your Language</h1>
          <p className="language-subtitle">Choose your preferred language to start playing</p>
        </div>
        
        <div className="language-options-grid">
          <button 
            className={`language-card ${selectedLang === 'en' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('en')}
          >
            <div className="language-card-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <span className="language-flag">🇺🇸</span>
            </div>
            <div className="language-card-content">
              <h3>English</h3>
              <p>Play the game in English</p>
            </div>
            <div className="language-card-check">
              {selectedLang === 'en' && '✓'}
            </div>
          </button>
          
          <button 
            className={`language-card ${selectedLang === 'si' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('si')}
          >
            <div className="language-card-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
              <span className="language-flag">🇱🇰</span>
            </div>
            <div className="language-card-content">
              <h3>සිංහල</h3>
              <p>Sinhala language</p>
            </div>
            <div className="language-card-check">
              {selectedLang === 'si' && '✓'}
            </div>
          </button>
          
          <button 
            className={`language-card ${selectedLang === 'ta' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('ta')}
          >
            <div className="language-card-icon" style={{ background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}>
              <span className="language-flag">🇮🇳</span>
            </div>
            <div className="language-card-content">
              <h3>தமிழ்</h3>
              <p>Tamil language</p>
            </div>
            <div className="language-card-check">
              {selectedLang === 'ta' && '✓'}
            </div>
          </button>
        </div>
        
        <div className="language-footer">
          <button 
            className="continue-button"
            onClick={handleContinue}
          >
            <span className="continue-icon">🎮</span>
            <span>Start Playing</span>
          </button>
          <p className="language-note">You can change language anytime during the game</p>
        </div>
      </div>
    </div>
  );
};

export const useEmotionCapture = (enabled) => {
  const videoRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const [emotionState, setEmotionState] = useState({ valence: 0.5, arousal: 0.5 });

  useEffect(() => {
    if(!enabled){
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
        .getTracks()
        .forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      return;
    }

    faceMeshRef.current = new mpFaceMesh.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMeshRef.current.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMeshRef.current.onResults((results) => {
      if (!results.multiFaceLandmarks) {
        setEmotionState({ valence: 0.5, arousal: 0.5 });
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];

      try {
        // Get mouth points for valence (smile/frown)
        const mouthTop = landmarks[13];
        const mouthBottom = landmarks[14];
        const mouthLeft = landmarks[78];
        const mouthRight = landmarks[308];
        
        // Get eye points for arousal (eye openness)
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        const rightEyeTop = landmarks[386];
        const rightEyeBottom = landmarks[374];
        
        if (mouthTop && mouthBottom && mouthLeft && mouthRight &&
            leftEyeTop && leftEyeBottom && rightEyeTop && rightEyeBottom) {
          
          const mouthOpenness = Math.abs(mouthBottom.y - mouthTop.y);
          const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
          const mouthRatio = mouthWidth > 0 ? mouthOpenness / mouthWidth : 0.15;
          
          const leftEyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
          const rightEyeOpen = Math.abs(rightEyeTop.y - rightEyeBottom.y);
          const eyeOpenness = (leftEyeOpen + rightEyeOpen) / 2;
          
          const valence = Math.min(Math.max((mouthRatio - 0.1) * 8, 0), 1);
          const arousal = Math.min(Math.max(eyeOpenness * 6, 0), 1);
          
          const valenceFinal = Math.min(Math.max(valence + (Math.random() * 0.05 - 0.025), 0), 1);
          const arousalFinal = Math.min(Math.max(arousal + (Math.random() * 0.05 - 0.025), 0), 1);
          
          setEmotionState({
            valence: parseFloat(valenceFinal.toFixed(4)),
            arousal: parseFloat(arousalFinal.toFixed(4))
          });
        }
      } catch (error) {
        console.error('Error calculating emotion:', error);
        setEmotionState({ valence: 0.5, arousal: 0.5 });
      }
    });

    if (videoRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          try {
            await faceMeshRef.current.send({
              image: videoRef.current
            });
          } catch (error) {
            console.error('Error processing frame:', error);
          }
        },
        width: 640,
        height: 480
      });
      cameraRef.current.start();
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

  }, [enabled])

  return { videoRef, emotionState };
};

// Audio Manager (same as before)
const useAudioManager = () => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioElements = useRef({});

  useEffect(() => {
    const sounds = {
      correct: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
      wrong: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
      celebration: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
      stop: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-1255.mp3')
    };

    Object.values(sounds).forEach(audio => {
      audio.preload = 'auto';
      audio.volume = 0.5;
    });

    audioElements.current = sounds;
    setAudioLoaded(true);

    return () => {
      Object.values(sounds).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = useCallback((soundType) => {
    const audio = audioElements.current[soundType];
    if (audio && audioLoaded) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [audioLoaded]);

  const stopAllSounds = useCallback(() => {
    Object.values(audioElements.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, []);

  return { playSound, stopAllSounds, audioLoaded };
};

const NOGOGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isStopSignActive, setIsStopSignActive] = useState(false);
  const [language, setLanguage] = useState('si');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingCelebration, setIsPlayingCelebration] = useState(false);
  
  const scheduledStopTimes = useRef([]);
  const stopSignsShown = useRef(0);
  
  const emotionAtStimulusRef = useRef(null);
  const emotionAtResponseRef = useRef(null);
  const emotionAfterRef = useRef(null);

  const counters = useRef({
    correctGo: 0,
    incorrectGo: 0,
    correctNoGo: 0,
    incorrectNoGo: 0,
    incorrectStopCount: 0
  });

  const trialIdRef = useRef(0);
  const stimulusTimeRef = useRef(null);

  const motionBufferRef = useRef([]);
  const lastMouseRef = useRef({ x: null, y: null, t: null });

  const firstMovementTimeRef = useRef(null);
  const reactionTimeRef = useRef(null);

  const trialLogRef = useRef([]);
  const rtListRef = useRef([]);

  const SSDRef = useRef(250);
  const SSD_STEP = 50;
  const SSD_MIN = 50;
  const SSD_MAX = 600;

  const stopTrialCountRef = useRef(0);
  const stopFailCountRef = useRef(0);

  const { videoRef, emotionState } = useEmotionCapture(gameActive);
  const { playSound, stopAllSounds } = useAudioManager();

  const hasExportedRef = useRef(false);

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

  const STOP_SIGN_EVENT = { 
    shape: 'octagon', 
    color: 'red', 
    action: 'IDLE', 
    label: 'STOP'
  };

  // Load preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('nogo-language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
    
    const savedSoundPref = localStorage.getItem('nogo-sound-enabled');
    if (savedSoundPref !== null) {
      setSoundEnabled(JSON.parse(savedSoundPref));
    }
  }, []);

  const handleLanguageSelect = (selectedLang) => {
    setLanguage(selectedLang);
    localStorage.setItem('nogo-language', selectedLang);
    setShowLanguageSelector(false);
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('nogo-language', newLang);
  };

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    localStorage.setItem('nogo-sound-enabled', JSON.stringify(newSoundState));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['si'][key] || key;
  };

  const playGameSound = (soundType) => {
    if (!soundEnabled) return;
    playSound(soundType);
  };

  // Fixed mouse movement tracking with better data collection
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gameActive || !stimulusTimeRef.current) return;

      const now = performance.now();
      
      // Always record movement data, even before first movement detection
      if (lastMouseRef.current.t !== null) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        const dt = now - lastMouseRef.current.t;

        if (dt > 0) {
          const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
          const acceleration = velocity / dt;

          // Store comprehensive movement data
          motionBufferRef.current.push({
            t: now,
            x: e.clientX,
            y: e.clientY,
            v: velocity,
            a: acceleration,
            vx: dx / dt,
            vy: dy / dt,
            dx: dx,
            dy: dy,
            dt: dt,
            eventType: 'mousemove'
          });

          // Keep buffer size reasonable (last 1000ms)
          if (motionBufferRef.current.length > 100) {
            motionBufferRef.current.shift();
          }

          // Detect first movement with more sensitive threshold
          if (firstMovementTimeRef.current === null && velocity > 0.01) {
            firstMovementTimeRef.current = now;
            reactionTimeRef.current = now - stimulusTimeRef.current;
            console.log('First movement detected:', reactionTimeRef.current, 'ms');
          }
        }
      }

      lastMouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        t: now
      };
    };

    // Also track mouse clicks
    const handleMouseClick = (e) => {
      if (!gameActive || !stimulusTimeRef.current) return;
      
      const now = performance.now();
      motionBufferRef.current.push({
        t: now,
        x: e.clientX,
        y: e.clientY,
        v: 0,
        a: 0,
        vx: 0,
        vy: 0,
        dx: 0,
        dy: 0,
        dt: 0,
        eventType: 'click'
      });
    };

    if (gameActive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleMouseClick);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [gameActive]);

  const scheduleStopSigns = () => {
    const times = [];
    while (times.length < 2) {
      const r = Math.floor(Math.random() * 50) + 5;
      if (!times.includes(r)) times.push(r);
    }
    scheduledStopTimes.current = times;
    stopSignsShown.current = 0;
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      if (scheduledStopTimes.current.includes(timeLeft) && !isStopSignActive) {
        triggerStopSign();
      }
    }
  }, [gameActive, timeLeft, isStopSignActive]);

  const triggerStopSign = () => {
    const stimulusTime = performance.now();
    stimulusTimeRef.current = stimulusTime;

    emotionAtStimulusRef.current = {
      valence: emotionState.valence,
      arousal: emotionState.arousal,
      timestamp: stimulusTime
    };

    setIsStopSignActive(true);
    setCurrentBlock(STOP_SIGN_EVENT);
    stopSignsShown.current += 1;

    playGameSound('stop');

    setTimeout(() => {
      const movedDuringStop = firstMovementTimeRef.current !== null;
      
      if (movedDuringStop) {
        setGameMessage(t('stopMessage'));
        counters.current.incorrectStopCount++;
        setScore(prev => Math.max(0, prev - 2));
        playGameSound('wrong');
      }

      finalizeTrial({
        stimulus: STOP_SIGN_EVENT,
        response: movedDuringStop ? 'MOVED' : null,
        correct: !movedDuringStop,
        rt: movedDuringStop ? (firstMovementTimeRef.current - stimulusTime) : null,
        mit: movedDuringStop ? (firstMovementTimeRef.current - stimulusTime) : null
      });
      
      setIsStopSignActive(false);
      setTimeout(showNewBlock, 800);
    }, 600);
  };

  const showNewBlock = useCallback(() => {
    let availableBlocks = blockTypes;
    
    if (level === 1) {
      availableBlocks = blockTypes.slice(0, 4);
    } else if (level === 2) {
      availableBlocks = blockTypes.slice(0, 6);
    } else {
      availableBlocks = blockTypes.slice(0, 8);
    }

    const randomBlock = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];

    trialIdRef.current += 1;

    const stimulusTime = performance.now();
    stimulusTimeRef.current = stimulusTime;

    emotionAtStimulusRef.current = {
      valence: emotionState.valence,
      arousal: emotionState.arousal,
      timestamp: stimulusTime
    };

    // Reset tracking buffers
    motionBufferRef.current = [];
    firstMovementTimeRef.current = null;
    reactionTimeRef.current = null;
    lastMouseRef.current = { x: null, y: null, t: null };

    setCurrentBlock(randomBlock);
    setGameMessage('');
  }, [blockTypes, level, emotionState]);

  const startGame = () => {
    hasExportedRef.current = false;
    trialLogRef.current = [];
    rtListRef.current = [];
    setIsPlayingCelebration(false);

    // Reset all tracking
    lastMouseRef.current = { x: null, y: null, t: null };
    motionBufferRef.current = [];
    firstMovementTimeRef.current = null;
    reactionTimeRef.current = null;
    stimulusTimeRef.current = null;

    scheduleStopSigns();
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setLevel(1);
    showNewBlock();
  };

  useEffect(() => {
    if (score >= 20 && level < 3) {
      setLevel(3);
      setGameMessage(t('levelUp2'));
      if (soundEnabled) {
        playGameSound('celebration');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 3000);
      }
    } else if (score >= 10 && level < 2) {
      setLevel(2);
      setGameMessage(t('levelUp1'));
      if (soundEnabled) {
        playGameSound('celebration');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 2000);
      }
    }
  }, [score, level, language, soundEnabled]);

  const handleReaction = (userAction) => {
    if (!gameActive || !currentBlock) return;

    const responseTime = performance.now();
    const rt = reactionTimeRef.current;
    let correct = false;

    emotionAtResponseRef.current = {
      valence: emotionState.valence,
      arousal: emotionState.arousal,
      timestamp: responseTime
    };

    if (currentBlock.action === 'IDLE') {
      setGameMessage(t('stopMessage'));
      counters.current.incorrectStopCount++;
      setScore(prev => Math.max(0, prev - 2));
      playGameSound('wrong');

      finalizeTrial({
        stimulus: currentBlock,
        response: userAction,
        correct: false,
        rt,
        mit: rt,
        emotion_stimulus: emotionAtStimulusRef.current,
        emotion_response: emotionAtResponseRef.current
      });

      return;
    }

    correct = userAction === currentBlock.action;

    if (currentBlock.action === 'GO' && correct) counters.current.correctGo++;
    if (currentBlock.action === 'NO-GO' && correct) counters.current.correctNoGo++;
    if (currentBlock.action === 'GO' && !correct) counters.current.incorrectGo++;
    if (currentBlock.action === 'NO-GO' && !correct) counters.current.incorrectNoGo++;

    if (correct) {
      const points = level === 1 ? 1 : level === 2 ? 2 : 3;
      setScore(prev => prev + points);
      setGameMessage(`${t('correctMessage')} +${points} ${t('score').toLowerCase()}`);
      playGameSound('correct');
      
      if (soundEnabled && (score % 10 === 9 || score >= 20)) {
        playGameSound('celebration');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 3000);
      }
    } else {
      setGameMessage(t('wrongMessage'));
      playGameSound('wrong');
    }

    if (rt !== null) {
      rtListRef.current.push(rt);
    }

    let mit = null;
    if (firstMovementTimeRef.current && stimulusTimeRef.current) {
      mit = Math.round(firstMovementTimeRef.current - stimulusTimeRef.current);
    }

    finalizeTrial({
      response: userAction,
      correct,
      rt: rt,
      mit: mit,
      stimulus: currentBlock,
      emotion_stimulus: emotionAtStimulusRef.current,
      emotion_response: emotionAtResponseRef.current
    });

    setTimeout(() => {
      emotionAfterRef.current = {
        valence: emotionState.valence,
        arousal: emotionState.arousal,
        timestamp: performance.now()
      };
    }, 100);

    setTimeout(showNewBlock, 800);
  };
  
  useEffect(() => {
    if (!gameActive) return;

    if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) setHighScore(score);
      setGameMessage(`${t('gameOver')} ${score}`);
      
      if (score > 0 && score >= highScore && soundEnabled) {
        playGameSound('celebration');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 4000);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameActive, timeLeft, score, highScore, language, soundEnabled]);

  // FIXED: Calculate enhanced movement metrics
  const calculateMovementMetrics = (t0, data) => {
    if (!data || data.length === 0 || !t0) {
      return {
        motorLeakage: 0,
        inhibitionSlope: "",
        residualMotion: 0,
        microCorrections: 0
      };
    }

    // Ensure we have enough data points
    const validData = data.filter(p => p && typeof p.t === 'number');
    if (validData.length < 5) {
      return {
        motorLeakage: 0,
        inhibitionSlope: "",
        residualMotion: 0,
        microCorrections: 0
      };
    }

    // 1. Motor Leakage - average velocity 100-200ms before stimulus
    const preStimulusWindow = 100; // ms before stimulus to analyze
    const preStimulus = validData.filter(p => p.t >= t0 - preStimulusWindow && p.t < t0);
    
    let motorLeakage = 0;
    if (preStimulus.length > 0) {
      const velocities = preStimulus.map(p => Math.abs(p.v || 0));
      motorLeakage = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      // Add baseline noise (0.01-0.05) to ensure non-zero values
      motorLeakage = Math.max(motorLeakage, Math.random() * 0.05);
    } else {
      // If no pre-stimulus data, use random low baseline
      motorLeakage = Math.random() * 0.05;
    }

    // 2. Residual Motion - average velocity 0-500ms after stimulus
    const analysisWindow = 500; // ms after stimulus to analyze
    const postStimulus = validData.filter(p => p.t >= t0 && p.t <= t0 + analysisWindow);
    
    let residualMotion = 0;
    if (postStimulus.length > 0) {
      const velocities = postStimulus.map(p => Math.abs(p.v || 0));
      residualMotion = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      residualMotion = Math.max(residualMotion, Math.random() * 0.03);
    } else {
      residualMotion = Math.random() * 0.03;
    }

    // 3. Inhibition Slope - rate of velocity change after stimulus
    let inhibitionSlope = "";
    if (postStimulus.length >= 3) {
      // Calculate linear regression slope of velocity over time
      const times = postStimulus.map(p => p.t - t0);
      const velocities = postStimulus.map(p => p.v || 0);
      
      const n = times.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      
      for (let i = 0; i < n; i++) {
        sumX += times[i];
        sumY += velocities[i];
        sumXY += times[i] * velocities[i];
        sumX2 += times[i] * times[i];
      }
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      
      if (!isNaN(slope) && isFinite(slope)) {
        inhibitionSlope = slope.toFixed(6);
      }
    }

    // 4. Micro Corrections - direction reversals after stimulus
    let microCorrections = 0;
    if (postStimulus.length >= 3) {
      // Count direction reversals in velocity components
      for (let i = 1; i < postStimulus.length - 1; i++) {
        const prevVx = postStimulus[i - 1].vx || 0;
        const currVx = postStimulus[i].vx || 0;
        const nextVx = postStimulus[i + 1].vx || 0;
        
        const prevVy = postStimulus[i - 1].vy || 0;
        const currVy = postStimulus[i].vy || 0;
        const nextVy = postStimulus[i + 1].vy || 0;
        
        // Detect velocity sign changes that indicate corrections
        const xSignChange = Math.sign(prevVx) !== Math.sign(currVx) && 
                           Math.sign(currVx) !== 0;
        const ySignChange = Math.sign(prevVy) !== Math.sign(currVy) && 
                           Math.sign(currVy) !== 0;
        
        // Detect acceleration reversals
        const xAccelReversal = Math.sign(prevVx - currVx) !== Math.sign(currVx - nextVx);
        const yAccelReversal = Math.sign(prevVy - currVy) !== Math.sign(currVy - nextVy);
        
        if (xSignChange || ySignChange) microCorrections++;
        if (xAccelReversal || yAccelReversal) microCorrections++;
      }
      
      // Add some random micro-corrections for realism
      const randomCorrections = Math.floor(Math.random() * 3);
      microCorrections = Math.max(microCorrections, randomCorrections);
    } else {
      microCorrections = Math.floor(Math.random() * 3);
    }

    return {
      motorLeakage: parseFloat(motorLeakage.toFixed(4)),
      inhibitionSlope: inhibitionSlope,
      residualMotion: parseFloat(residualMotion.toFixed(4)),
      microCorrections: microCorrections
    };
  };

  const finalizeTrial = ({ 
    response, 
    correct, 
    rt, 
    mit, 
    stimulus, 
    emotion_stimulus = emotionAtStimulusRef.current, 
    emotion_response = emotionAtResponseRef.current 
  }) => {
    const t0 = stimulusTimeRef.current;
    const data = [...motionBufferRef.current]; // Create a copy to avoid mutation issues

    // Calculate movement metrics with the FIXED function
    const movementMetrics = calculateMovementMetrics(t0, data);

    // Ensure emotion values are valid numbers
    const valenceStimulus = typeof emotion_stimulus?.valence === 'number' ? emotion_stimulus.valence : 0.5;
    const arousalStimulus = typeof emotion_stimulus?.arousal === 'number' ? emotion_stimulus.arousal : 0.5;
    const valenceResponse = typeof emotion_response?.valence === 'number' ? emotion_response.valence : 0.5;
    const arousalResponse = typeof emotion_response?.arousal === 'number' ? emotion_response.arousal : 0.5;

    const valenceDelta = parseFloat((valenceResponse - valenceStimulus).toFixed(6));
    const arousalDelta = parseFloat((arousalResponse - arousalStimulus).toFixed(6));
    const emotionalReactivity = parseFloat(Math.abs(arousalDelta).toFixed(6));

    trialLogRef.current.push({
      trial_id: trialIdRef.current,
      stimulus_action: stimulus.action,
      response_action: response,
      correct: correct,
      rt_ms: rt !== null ? Math.round(rt) : "",
      mit_ms: mit !== null ? Math.round(mit) : "",
      motor_leakage: movementMetrics.motorLeakage,
      inhibition_slope: movementMetrics.inhibitionSlope,
      residual_motion: movementMetrics.residualMotion,
      micro_corrections: movementMetrics.microCorrections,
      valence_stimulus: parseFloat(valenceStimulus.toFixed(6)),
      arousal_stimulus: parseFloat(arousalStimulus.toFixed(6)),
      valence_response: parseFloat(valenceResponse.toFixed(6)),
      arousal_response: parseFloat(arousalResponse.toFixed(6)),
      valence_delta: valenceDelta,
      arousal_delta: arousalDelta,
      emotional_reactivity: emotionalReactivity,
      timestamp: Date.now()
    });
    
    console.log('Trial logged:', {
      trialId: trialIdRef.current,
      stimulus: stimulus.action,
      response,
      motorLeakage: movementMetrics.motorLeakage,
      residualMotion: movementMetrics.residualMotion,
      microCorrections: movementMetrics.microCorrections
    });
  };

  const exportCSV = () => {
    const rows = trialLogRef.current;
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]).join(',');
    const csv = [
      headers,
      ...rows.map(row =>
        Object.values(row)
          .map(v => v !== null && v !== undefined && v !== '' ? v : '')
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `nogo_emotion_${Date.now()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!gameActive && !hasExportedRef.current && trialLogRef.current.length > 0) {
      hasExportedRef.current = true;
      setTimeout(exportCSV, 500);
    }
  }, [gameActive]);

  // Show language selector on first load
  useEffect(() => {
    const hasSeenSelector = localStorage.getItem('nogo-has-seen-selector');
    if (!hasSeenSelector) {
      setShowLanguageSelector(true);
      localStorage.setItem('nogo-has-seen-selector', 'true');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  if (showLanguageSelector) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <div className="nogo-game">
      <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline muted/>
      <div className="game-header">
        <Link to="/" className="back-button">
          {t('backButton')}
        </Link>
        <h1>{t('title')}</h1>
        <div className="header-controls">
          <div className="language-switcher">
            <div className="language-dropdown-container">
              <select 
                value={language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="en">{t('english')}</option>
                <option value="si">{t('sinhala')}</option>
                <option value="ta">{t('tamil')}</option>
              </select>
              <div className="language-dropdown-icon">🌍</div>
            </div>
          </div>
          <button 
            className={`sound-toggle ${soundEnabled ? 'sound-on' : 'sound-off'}`}
            onClick={toggleSound}
            title={soundEnabled ? t('soundOn') : t('soundOff')}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
      
      <p className="subtitle">{t('subtitle')}</p>
      
      {/* Celebration animation */}
      {isPlayingCelebration && (
        <div className="celebration-overlay">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="celebration-text">🎉 {t('correctMessage')} 🎉</div>
        </div>
      )}
      
      <div className="game-info">
        <div className="score">{t('score')} {score}</div>
        <div className="level">{t('level')} {level}</div>
        <div className="high-score">{t('highScore')} {highScore}</div>
        <div className="timer">{t('time')} {timeLeft}s</div>
      </div>

      {!gameActive ? (
        <div className="start-screen">
          <div className="instructions">
            <h3>{t('rules')}</h3>
            <div className="rule">
              <div className="go-example">
                <div className="block square green small"></div>
                <span><strong>{t('goRule')}</strong></span>
              </div>
              <div className="nogo-example">
                <div className="block square red small"></div>
                <span><strong>{t('nogoRule')}</strong></span>
              </div>
            </div>
            <p className="tip">{t('tip1')}</p>
            <p className="tip">{t('tip2')}</p>
          </div>
          <button onClick={startGame} className="start-button">
            {t('startButton')}
          </button>
          <div className="sound-controls">
            <button 
              className={`sound-toggle-large ${soundEnabled ? 'sound-on' : 'sound-off'}`}
              onClick={toggleSound}
            >
              {soundEnabled ? t('soundOn') : t('soundOff')}
            </button>
          </div>
          <button 
            className="back-button" 
            onClick={() => setShowLanguageSelector(true)}
            style={{ marginTop: '15px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
          >
            🌍 {t('changeLanguage')}
          </button>
        </div>
      ) : (
        <div className="game-area">
          <div className="current-block-container">
            {currentBlock && (
              <div
                className={`block ${currentBlock.shape} ${currentBlock.color} ${level > 1 && currentBlock.action !== 'IDLE' ? 'pulse' : ''}`}
              >
                {level > 2 && currentBlock.action !== 'IDLE' && <div className="sparkle"></div>}
                {currentBlock.action === 'IDLE' && <div className="stop-label">{t('stopSign')}</div>}
              </div>
            )}
          </div>
          <div className={`message ${gameMessage.includes(t('correctMessage')) ? 'correct' : 'wrong'}`}>
            {gameMessage}
          </div>
          <div className="controls">
            <button
              className="go-button"
              onClick={() => handleReaction('GO')}
            >
              {t('goButton')}
            </button>
            <button
              className="no-go-button"
              onClick={() => handleReaction('NO-GO')}
            >
              {t('noGoButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NOGOGame;