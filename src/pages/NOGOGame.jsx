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


export const useEmotionCapture = (enabled) => {
  const videoRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const [emotionState, setEmotionState] = useState({ valence: 0.5, arousal: 0.5 });

  // A ref that holds the latest values
  const latestEmotionRef = useRef({ valence: 0.5, arousal: 0.5 });


  // Euclidean distance between two 3D landmarks
  const getDistance = (p1, p2) => {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) + 
      Math.pow(p1.y - p2.y, 2) + 
      Math.pow(p1.z - p2.z, 2)
    );
  };

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
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

      const landmarks = results.multiFaceLandmarks[0];

      // NORMALIZATION FACTOR
      // Distance between outer eye corners (33 and 263) scales the face size (eye distance as a scale factor)
      const faceWidth = getDistance(landmarks[33], landmarks[263]);

      // VALENCE (SMILE) - Mouth Ratio(Height/Width) - Scale-invariant smile detection
      const mouthHeight = getDistance(landmarks[13], landmarks[14]);
      const mouthWidth = getDistance(landmarks[78], landmarks[308]);
      const mouthRatio = mouthHeight / (mouthWidth || 0.1);
      const valence = Math.min(Math.max((mouthRatio - 0.1) * 8, 0), 1);

      // Distance between top lip (13) and bottom lip (14)
      // const mouthGap = getDistance(landmarks[13], landmarks[14]);
      // const normalizedSmile = mouthGap / faceWidth;

      // Map normalizedSmile (typically 0.05 to 0.2) to 0-1 scale
      // Offset by 0.05 (neutral) and multiply for sensitivity
      // const valence = Math.min(Math.max((normalizedSmile - 0.05) * 5, 0), 1);


      // AROUSAL (EYE OPENNESS)
      const leftEyeGap = getDistance(landmarks[159], landmarks[145]);
      const rightEyeGap = getDistance(landmarks[386], landmarks[374]);
      const avgEyeGap = (leftEyeGap + rightEyeGap) / 2;
      const normalizedEyes = avgEyeGap / faceWidth;

      //Map normalizedEyes (typically 0.02 to 0.06) to 0-1 scale
      const arousal = Math.min(Math.max((normalizedEyes - 0.02) * 20, 0), 1);

      const payload = { valence: parseFloat(valence.toFixed(4)), arousal: parseFloat(arousal.toFixed(4)) };

      // Update Ref immediately (for precise data logging)
      // latestEmotionRef.current = { valence, arousal };

      latestEmotionRef.current = payload;

      // setEmotionState({valence: valence, arousal: arousal});
      setEmotionState(payload);
    });

    if (videoRef.current) {

      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {if (faceMeshRef.current)
          await faceMeshRef.current.send({
            image: videoRef.current
          });
        },
        width: 640,
        height: 480
      });

      cameraRef.current.start();
    }

    return () => {
      if (cameraRef.current) {cameraRef.current.stop();}
      if (faceMeshRef.current) faceMeshRef.current.close();
    };

  }, [enabled])

  return { videoRef, emotionState, latestEmotionRef };

};


const NOGOGame = () => {

  const gameStartedRef = useRef(false); // Game started or not

  const currentActionRef = useRef(''); // track current block


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
  const { playSound, stopAllSounds } = useAudioManager();

  const stopSignalTimerRef = useRef(null); // SSD delay
  const stopStayTimerRef = useRef(null);  // Window to stay still during Stop
  const trialEndedRef = useRef(false); // trial end guard
  const trialTimeoutRef = useRef(null); // timout for trial 
  
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


  // --- Trial & timing ---
  const trialIdRef = useRef(0);
  const stimulusTimeRef = useRef(null);

  // Inter-Trial Interval (ms)
  const ITI_MIN = 300;  // minimum blank time
  const ITI_MAX = 600;  // maximum blank time (jitter)
  const BLANK_EVENT = 'BLANK';

  // --- Mouse movement ---
  const motionBufferRef = useRef([]); // {t, x, y, v}
  const lastMouseRef = useRef({ x: null, y: null, t: null });

  // --- Reaction & movement ---
  const firstMovementTimeRef = useRef(null);
  const reactionTimeRef = useRef(null);

  // --- Logging ---
  const trialLogRef = useRef([]); // FINAL CSV rows
  const rtListRef = useRef([]);   // for RTV
  
  // Stair Case rule for stop sign
  const SSDRef = useRef(250); // initial SSD (ms)
  const SSD_STEP = 50;
  const SSD_MIN = 50;
  const SSD_MAX = 600;

  const stopTrialCountRef = useRef(0);
  const stopFailCountRef = useRef(0);
  const isStopTrialRef = useRef(false);

  // emotion capture
  const { videoRef, emotionState, latestEmotionRef} = useEmotionCapture(gameActive);

  // export data
  const hasExportedRef = useRef(false);

  const calculateSSRT = () => {
    const validGoRTs = rtListRef.current.filter(rt => rt > 150).sort((a, b) => a - b);
    if (validGoRTs.length === 0) return 0;

    // The Integration Method:
    // SSRT = nth RT - Average SSD
    // where n is the probability of responding given a stop signal
    const probFailure = stopFailCountRef.current / Math.max(stopTrialCountRef.current, 1);
    const index = Math.floor(probFailure * validGoRTs.length);
    const nthRT = validGoRTs[Math.min(index, validGoRTs.length - 1)];
  
    return nthRT - SSDRef.current;
  };

  const aggregateGameData = () => {
    const trials = trialLogRef.current;
    if (!trials || trials.length === 0) return null;

    const validRTs = trials
      .filter(t => t.rt_ms != null && t.rt_ms > 0)
      .map(t => t.rt_ms);

    const mean = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
    const sd = arr => {
      const m = mean(arr);
      return arr.length ? Math.sqrt(arr.reduce((s,x)=>s + Math.pow(x-m,2),0)/arr.length) : 0;
    };
    

    // GO / NO-GO / STOP
    const goTrials = trials.filter(t => t.stimulus_action === 'GO');
    const nogoTrials = trials.filter(t => t.stimulus_action === 'NO-GO');
    const stopTrials = trials.filter(t => t.stimulus_action === 'IDLE');

    const getRate = (arr) => arr.length ? arr.filter(t => t.correct === 1).length / arr.length : 0;

    return {
      total_trials: trials.length,
      score,
      level,
      high_score: highScore,

      mean_rt: mean(validRTs),
      sd_rt: sd(validRTs),
      rt_variability: mean(validRTs) > 0 ? sd(validRTs)/mean(validRTs) : 0,

      correct_go_rate: getRate(goTrials),
      correct_nogo_rate: getRate(nogoTrials),
      stop_success_rate: getRate(stopTrials),

      mean_mit: mean(trials.map(t=>t.mit_ms).filter(v=>v!=null)),
      mean_leakage: mean(trials.map(t=>t.motor_leakage)) || 0,
      mean_inhibition_slope: mean(trials.map(t=>t.inhibition_slope).filter(v=>v!=null)) || 0,
      mean_residual_motion: mean(trials.map(t=>t.residual_motion)) || 0,
      mean_micro_corrections_hesitationCount: mean(trials.map(t=>t.hesitationCount)) || 0,
      mean_micro_corrections_swerveCount: mean(trials.map(t=>t.swerveCount)) || 0,

      mean_valence_stimulus: mean(trials.map(t=>t.valence_stimulus).filter(v=>v!=null)),
      mean_valence_response: mean(trials.map(t=>t.valence_response).filter(v=>v!=null)),
      mean_valence_delta: mean(trials.map(t=>t.valence_delta).filter(v=>v!=null)),
      mean_arousal_stimulus: mean(trials.map(t=>t.arousal_stimulus).filter(v=>v!=null)),
      mean_arousal_response: mean(trials.map(t=>t.arousal_response).filter(v=>v!=null)),
      mean_arousal_delta: mean(trials.map(t=>t.arousal_delta).filter(v=>v!=null)),
      mean_emotional_reactivity: mean(trials.map(t=>t.emotional_reactivity).filter(v=>v!=null)),

      total_stop_trials: stopTrialCountRef.current,
      failed_stops: stopFailCountRef.current,
      timestamp: Date.now()
    };
  };
  
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

  useEffect(() => {

      if (gameStartedRef.current && !gameActive && !hasExportedRef.current) {
        hasExportedRef.current = true;

        const aggregatedRow = aggregateGameData();
        console.log("Aggregated Game Row:", aggregatedRow);

        // Optionally export as CSV with one row
        const headers = Object.keys(aggregatedRow).join(',');
        const csv = [
          headers,
          Object.values(aggregatedRow).map(v => JSON.stringify(v ?? '')).join(',')
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nogo_aggregated_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, [gameActive]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gameActive) return; // executes only when gameActive if not exit.

      // get time precisely with miliseconds 
      // Returns a high-resolution timestamp (sub-millisecond precision)
      //  Monotonic → not affected by system clock changes
      const now = performance.now(); 
      //let vx = 0, vy = 0, velocity = 0;

      const dx = lastMouseRef.current.x !== null ? e.clientX - lastMouseRef.current.x : 0;
      const dy = lastMouseRef.current.y !== null ? e.clientY - lastMouseRef.current.y : 0;
      const dt = lastMouseRef.current.t !== null ? now - lastMouseRef.current.t : 1; // avoid div by 0

      const vx = dx/dt;
      const vy = dy/dt;
      const velocity = Math.sqrt(vx*vx + vy*vy);

      motionBufferRef.current.push({ t: now, x: e.clientX, y: e.clientY, vx, vy, v: velocity });

      if (!firstMovementTimeRef.current && velocity > 0.005) { // lower threshold
        firstMovementTimeRef.current = now;
        reactionTimeRef.current = now - stimulusTimeRef.current;
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY, t: now };

      // only compute velocity if previous sample (mouse movement) already exists 
      // if (lastMouseRef.current.t !== null) { //check for last mouse time
      //   const dx = e.clientX - lastMouseRef.current.x; //Spatial displacement (dx, dy)
      //   const dy = e.clientY - lastMouseRef.current.y;
      //   const dt = now - lastMouseRef.current.t; //Temporal gap dt

      //   if (dt > 0) {
      //     vx = dx/dt;
      //     vy = dy/dt;
      //     velocity = Math.sqrt(dx * dx + dy * dy) / dt; //velocity=time elapsed/distance moved​

      //     // store continous motor trace (mouse movement) - time-series motor signal, velocity against time
      //     motionBufferRef.current.push({
      //       t: now,
      //       v: velocity,
      //       vx,
      //       vy
      //     });

      //     // Always push a motion sample even if lastMouseRef.current.t is null
      //     lastMouseRef.current = { x: e.clientX, y: e.clientY, t: now };

      //     motionBufferRef.current = motionBufferRef.current.filter(p => p.t >= now - 2000);

      //     // --- Movement Initiation Time (MIT)

      //     if (firstMovementTimeRef.current === null && velocity > 0.02) { //detects the first intentional movement, not noise. threshold (velocity >0.02) skips noisy movements only intentional fast movements captured
      //       // check if firstMovementTimeRef.current is null
      //       firstMovementTimeRef.current = now;
      //       reactionTimeRef.current = now - stimulusTimeRef.current;
      //     }
      //   }
      // }

      
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameActive]);

  const advanceTrial = () => {
    // 1. Show blank/fixation
    setCurrentBlock(BLANK_EVENT);

    // 2. Reset motion buffer & first movement
    motionBufferRef.current = [];
    firstMovementTimeRef.current = null;

    // 3. Random ITI
    const iti = ITI_MIN + Math.random() * (ITI_MAX - ITI_MIN);

    // 4. Schedule next trial
    setTimeout(() => {
      showNewBlock();
    }, iti);
  };

  const showNewBlock = useCallback(() => {
    // reset trial end guard
    trialEndedRef.current = false;

    // Clear any persistent timeouts from previous trials
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    if (stopSignalTimerRef.current) clearTimeout(stopSignalTimerRef.current);
    if (stopStayTimerRef.current) clearTimeout(stopStayTimerRef.current);
    
    
    lastMouseRef.current = { x: null, y: null, t: null };
    firstMovementTimeRef.current = null;
    reactionTimeRef.current = null;
    stimulusTimeRef.current = performance.now();

    const currentEmotions = latestEmotionRef?.current || { valence: 0, arousal: 0 };

    emotionAtStimulusRef.current = {
      valence: currentEmotions.valence,
      arousal: currentEmotions.arousal,
      timestamp: performance.now()
    };

    // 1. Basic Setup
    let availableBlocks = level === 1 ? blockTypes.slice(0, 4) : blockTypes;
    const randomBlock = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];

    trialIdRef.current += 1;

    const currentTrialId = trialIdRef.current;

    // 3. 25% Probability Logic
    // We only turn GO trials into STOP trials (standard scientific practice)
    const forceStop = stopTrialCountRef.current < 20 && trialIdRef.current > 30;

    const isStopTrial = randomBlock.action === 'GO' && (forceStop || Math.random() * 100 < 25);
    
    isStopTrialRef.current = isStopTrial;

    currentActionRef.current = randomBlock.action;
    setCurrentBlock(randomBlock);
    setGameMessage('');

    if (isStopTrial) {
      stopTrialCountRef.current++;
      // Schedule the STOP SIGN appearance
      stopSignalTimerRef.current = setTimeout(() => {
        // ONLY show if we are still on the same trial
        if (trialIdRef.current === currentTrialId && !trialEndedRef.current) {
          currentActionRef.current = 'IDLE';
          setCurrentBlock(STOP_SIGN_EVENT);
          setIsStopSignActive(true);
          playGameSound('stop');
          
          // automatic timeout: for the STOP signal
          stopStayTimerRef.current = setTimeout(() => {
            if (trialIdRef.current === currentTrialId && !trialEndedRef.current) {
              handleReaction('STAY'); 
            }
          }, 1500);
        }
      }, SSDRef.current);
    }

    // if (isStopTrial) {
    //   // TRIGGER STOP SIGNAL AFTER SSD
    //   setTimeout(() => {
    //     // Check if the user is still on the same trial (hasn't clicked yet)
    //     if (trialIdRef.current === currentTrialId) {
    //       setIsStopSignActive(true);
    //       setCurrentBlock(STOP_SIGN_EVENT);
          
    //       // Window to stay still
    //       setTimeout(() => {
    //         if (isStopSignActive) {
    //           handleReaction('STAY');
    //           setIsStopSignActive(false);
    //         }
    //       }, 800);
    //     }
    //   }, SSDRef.current);
    // } else {
    //   // NORMAL TRIAL TIMEOUT (Auto-resolve if no click)
    //   trialTimeoutRef.current = setTimeout(() => {
    //     handleReaction('STAY');
    //   }, 1200); 
    // }
  }, [level, blockTypes, latestEmotionRef, language, soundEnabled]);

 
  const startGame = () => {

    gameStartedRef.current = true; 
    hasExportedRef.current = false;
    trialLogRef.current = [];

    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setLevel(1);
    showNewBlock();
    setIsPlayingCelebration(false);

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
      //setGameMessage('මට්ටම 3! දුෂ්කර බ්ලොක් එකතු විය!');
    } else if (score >= 10 && level < 2) {
      setLevel(2);
      setGameMessage(t('levelUp1'));
      if (soundEnabled) {
        playGameSound('celebration');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 2000);
      }
      //setGameMessage('මට්ටම 2! නව බ්ලොක් එකතු විය!');
    }
  }, [score, level]);

  const handleReaction = (userAction) => {
    if (!gameActive || trialEndedRef.current) return; //exit if game not started or no any active current blocks

    trialEndedRef.current = true;

    // 1. IMMEDIATELY clear all pending timers to stop race conditions
    if (stopSignalTimerRef.current) clearTimeout(stopSignalTimerRef.current);
    if (stopStayTimerRef.current) clearTimeout(stopStayTimerRef.current);
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
   
    const actionOnScreen = currentActionRef.current;

    //const rt = reactionTimeRef.current; // first detected movement (MIT)
    const buttonRT = performance.now() - stimulusTimeRef.current;
    const rt = buttonRT;
    let correct = false;

    const currentEmotions = latestEmotionRef?.current || { valence: 0, arousal: 0 };

    // Emotion at response
    emotionAtResponseRef.current = {
      valence: currentEmotions.valence,
      arousal: currentEmotions.arousal,
      timestamp: performance.now()
    };

    if (actionOnScreen === 'IDLE') { // Stop-Signal event

      const stopLeakage = motionBufferRef.current
      .filter(p => p.t >= stimulusTimeRef.current)
      .reduce((s, p) => s + p.v, 0);

      const failedByMovement = stopLeakage > 0.05;

      if (userAction === 'STAY'  && !failedByMovement) {
        // SUCCESS: Increase SSD (make it harder next time)
        SSDRef.current = Math.min(SSDRef.current + SSD_STEP, SSD_MAX);
        correct = true;
        setScore(prev => prev + 5);
        setGameMessage(t('stopMessage'));
        setGameMessage('හරි! විශිෂ්ට පාලනයක්! +5');
      } else {
        // FAILURE: Decrease SSD (make it easier next time)
        SSDRef.current = Math.max(SSDRef.current - SSD_STEP, SSD_MIN);
        stopFailCountRef.current++;
        correct = false;
        setScore(prev => prev - 2);
        setGameMessage('නැවතිය යුතුව තිබුණි! -2');
        playGameSound('wrong');
      }
    }
    else{

      /* ---------------- GO / NO-GO ---------------- */
      correct = (userAction === actionOnScreen);

      // --- Accuracy counters (ML)
      if (currentBlock.action === 'GO' && correct) counters.current.correctGo++;
      if (currentBlock.action === 'NO-GO' && correct) counters.current.correctNoGo++;
      if (currentBlock.action === 'GO' && !correct) counters.current.incorrectGo++;
      if (currentBlock.action === 'NO-GO' && !correct) counters.current.incorrectNoGo++;

      // --- Score + feedback (GAME)
      if (correct) {
        const points = level === 1 ? 1 : level === 2 ? 2 : 3;
        setScore(prev => prev + points);
        //setGameMessage(`හරි! +${points} ලකුණු`);
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
        //setGameMessage('වැරදියි! ලකුණු නැත');
      }

    }

    // --- RT tracking (ML)
    if (rt !== null && userAction !== 'STAY') {
      rtListRef.current.push(rt); //reaction time is append to the rtListRef List of reaction times per each trial
    }

    // --- Finalize trial (ML) log data
    finalizeTrial({
      response: userAction,
      correct,
      rt,
      stimulus: currentBlock,
      emotion_stimulus: emotionAtStimulusRef.current,
      emotion_response: emotionAtResponseRef.current
    });

    // --- Optional: emotion immediately after response (non-invasive)
    setTimeout(() => {
        emotionAfterRef.current = {
        valence: emotionState.valence,
        arousal: emotionState.arousal,
        timestamp: performance.now()
      };
    }, 100);

    // --- Move to next block
    setIsStopSignActive(false);

    advanceTrial();

    // const baseDelay = 600;
    // const jitter = Math.floor(Math.random() * 600);

    // setTimeout(showNewBlock, baseDelay + jitter);
  };
  
  useEffect(() => {
    if (!gameActive) return;

    if (timeLeft === 0) {
      setGameActive(false);

      // 1. Calculate final metrics
      const finalSSRT = calculateSSRT();
      
      const validRTs = rtListRef.current.filter(rt => rt > 150);
      const meanRT = validRTs.length > 0 
        ? validRTs.reduce((a, b) => a + b, 0) / validRTs.length 
        : 0;
      
      // Calculate RTV (Reaction Time Variability)
      const sdRT = validRTs.length > 0
        ? Math.sqrt(validRTs.reduce((s, rt) => s + Math.pow(rt - meanRT, 2), 0) / validRTs.length)
        : 0;

      const RTV = meanRT > 0 ? sdRT / meanRT : 0;
      if (score > highScore) setHighScore(score);
      setGameMessage(`${t('gameOver')} ${score}`);

      if (score > 0 && score >= highScore && soundEnabled) {
        playGameSound('celebration');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 4000);
      }

      //setGameMessage(`ක්‍රීඩාව අවසන්! ඔබේ ලකුණු: ${score}`);

      trialLogRef.current.push({
        trial_id: 'SUMMARY',
        final_score: score,
        mean_go_rt: meanRT.toFixed(2),
        calculated_ssrt: finalSSRT ? finalSSRT.toFixed(2) : 'N/A',
        rt_variability: RTV.toFixed(3),
        total_stop_trials: stopTrialCountRef.current,
        failed_stops: stopFailCountRef.current,
        timestamp: Date.now()
      });

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [gameActive, timeLeft, score, highScore, language, soundEnabled]);

  useEffect(() => {
    const logMotion = (e) => {
      motionBufferRef.current.push({x: e.clientX, y: e.clientY, t: performance.now()});
      console.log('motion recorded', motionBufferRef.current.length); // check if numbers increase
    };
    document.addEventListener('mousemove', logMotion);
    return () => document.removeEventListener('mousemove', logMotion);
  }, []);



  const finalizeTrial = ({ response, correct, rt, stimulus, emotion_stimulus = emotionAtStimulusRef.current, emotion_response = emotionAtResponseRef.current }) => {
    //response → what the participant did
    // correct → whether the response matches the task
    // rt → reaction time (from stimulus → movement)
    // stimulus → metadata about the current trial

    const t0 = stimulusTimeRef.current; // timestamp when the stimulus (block) appeared
    const data = motionBufferRef.current; // continuous velocity time series collected during the trial
    const trialData = motionBufferRef.current.filter(p => p.t >= t0); // all mouse/motor movements that happened after the stimulus appeared.

    // --- Helper filters
    const preNoGo = motionBufferRef.current.filter(p => p.t >= t0 - 200 && p.t < t0); // preNoGo → 200ms before stimulus (block appeared) - Captures pre-stimulus motor leakage

    const postNoGo = trialData.filter(p => p.t >= t0 && p.t <= t0 + 500); // postNoGo → first 500ms after stimulus (block appeared) - Captures initial inhibition attempts or movement initiation

    // 1️⃣ MIT
    const mit = firstMovementTimeRef.current
      ? firstMovementTimeRef.current - t0
      : null;

    // 2️⃣ Pre-No-Go Motor Leakage
    const leakage = preNoGo.length > 0 ? preNoGo.reduce((s, p) => s + p.v, 0) / preNoGo.length : 0; // Default to 0 instead of null
    //const leakage = preNoGo.length ? preNoGo.reduce((s, p) => s + p.v, 0) / preNoGo.length : 0;

    // 3️⃣ Inhibition Slope using Linear Regression (y = mx + b)
    let slope = 0;
    if (postNoGo.length > 2) {
      const n = postNoGo.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      postNoGo.forEach(p => {
        const x = p.t - t0;
        const y = p.v;
        sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x;
      });
      slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    // 3️⃣ Inhibition Slope
    // let inhibitionSlope = null;
    // if (postNoGo.length > 2) {
    //   const v0 = postNoGo[0].v;
    //   const v1 = postNoGo[postNoGo.length - 1].v;
    //   const dt = postNoGo[postNoGo.length - 1].t - postNoGo[0].t;
    //   inhibitionSlope = dt > 0 ? (v1 - v0) / dt : null;
    // }

    // 4️⃣ Residual Motion
    // const residualMotion = postNoGo.reduce((s, p) => s + Math.abs(p.v), 0);
    const residualMotion = postNoGo.length > 0 ? postNoGo.reduce((s, p) => s + Math.abs(p.v), 0) : 0; // Default to 0 instead of null

    // 5️⃣ Micro-corrections
    // let microCorrections = 0;
    // for (let i = 1; i < data.length; i++) {

    //   const acc1 = data[i-1].v - data[i-2].v;
    //   const acc2 = data[i].v - data[i-1].v; 

    //   // If the user was speeding up and then suddenly slowed down (or vice versa)
    //   if (Math.sign(acc1) !== Math.sign(acc2) && Math.abs(acc1) > 0.01) {
    //     microCorrections++;
    //   }

    //   // if (Math.sign(data[i].v) !== Math.sign(data[i - 1].v)) {
    //   //   microCorrections++;
    //   // }
    // }

    let hesitationCount = 0; // Speed stuttering
    let swerveCount = 0;     // Directional changes

    for (let i = 2; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const prevPrev = data[i - 2];

      // 1. Detect Hesitations (Speed-based)
      // Acceleration flip: Speeding up then suddenly slowing down
      const acc1 = prev.v - prevPrev.v;
      const acc2 = curr.v - prev.v;
      if (Math.sign(acc1) !== Math.sign(acc2) && Math.abs(acc1) > 0.002) {
        hesitationCount++;
      }

      // 2. Detect Swerves (Vector-based)
      // Sign flip in X or Y components (moving Right then Left, or Up then Down)
      const flippedX = Math.sign(prev.vx) !== Math.sign(curr.vx) && Math.abs(curr.vx) > 0.002;
      const flippedY = Math.sign(prev.vy) !== Math.sign(curr.vy) && Math.abs(curr.vy) > 0.002;
      
      if (flippedX || flippedY) {
        swerveCount++;
      }
    }

     // Emotion deltas
    const valenceDelta =
    emotion_response?.valence != null && emotion_stimulus?.valence != null
      ? emotion_response.valence - emotion_stimulus.valence
      : null;

    const arousalDelta =
    emotion_response?.arousal != null && emotion_stimulus?.arousal != null
      ? emotion_response.arousal - emotion_stimulus.arousal
      : null;

    const emotionalReactivity =
    arousalDelta != null ? Math.abs(arousalDelta) : null;

    // --- Save trial row
    trialLogRef.current.push({
      trial_id: trialIdRef.current,

      // Task
      stimulus_action: isStopTrialRef.current ? 'IDLE' : stimulus.action,
      response_action: response,
      correct : correct ? 1 : 0,
      rt_ms: rt || 0,
      mit_ms: mit || 0,

      ssd_ms: stimulus.action === 'IDLE' ? SSDRef.current : null, 
      current_level: level,

      // Motor dynamics
      motor_leakage: leakage,
      inhibition_slope: slope,
      residual_motion: residualMotion,
      hesitationCount: hesitationCount || 0,
      swerveCount: swerveCount || 0,

      // Emotion
      valence_stimulus: emotion_stimulus?.valence ?? null,
      arousal_stimulus: emotion_stimulus?.arousal ?? null,
      valence_response: emotion_response?.valence ?? null,
      arousal_response: emotion_response?.arousal ?? null,
      valence_delta: valenceDelta,
      arousal_delta: arousalDelta,
      emotional_reactivity: emotionalReactivity,
      timestamp: Date.now()
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
          .map(v => JSON.stringify(v ?? ''))
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
            {currentBlock === BLANK_EVENT ? (<div className="fixation-dot" />)
             : currentBlock ? (
              <div
                className={`block ${currentBlock.shape} ${currentBlock.color} ${level > 1 && currentBlock.action !== 'IDLE' ? 'pulse' : ''}`}
                
              >
                {level > 2 && currentBlock.action !== 'IDLE' && <div className="sparkle"></div>}
                {currentBlock.action === 'IDLE' && <div className="stop-label">{t('stopSign')}</div>}
              </div>
            ):null}
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
