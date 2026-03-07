// src/components/games/JigsawPuzzle.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PuzzleBoard from './PuzzleBoard';
import PuzzlePiece from './PuzzlePiece';
import PuzzleControls from './PuzzleControls';
import PuzzleSuccess from './PuzzleSuccess';
import FeedbackMessage from './FeedbackMessage';
import { generatePuzzleGrid, shuffleArray, createPuzzlePieces } from '../../utils/puzzleUtils';
import { saveGameStats } from '../../utils/puzzleReportUtils';


// ADHD-friendly images
const puzzleImages = {
  easy: {
    url: 'https://img.pikbest.com/png-images/20250429/cute-baby-cat-clipart-with-transparent-background_11689513.png!sw800',
    title: 'Happy Cat',
    colors: 'from-orange-200 to-yellow-100'
  },
  medium: {
    url: 'https://imgproxy.fourthwall.com/FouLUU3ZmIPw2589cKmPPYEe3Pi21yJNIuaFW9XpfAg/w:1920/sm:1/enc/pdY3SnQCnzFhqWY3/hpEkFEylKuuDsnGR/saiCOZACV32A-DoG/ssoapcPHDMElASUQ/M3zfB2t39jLtCE7A/U2Qx2FOALkm-JfAW/FgPsTAPW2BW-Kxss/V4DBd7VzdR_VbaBa/HgKNCiSp5a2poLYl/y5XvRdMSQIt3zlJc/mY3nvXPS2djTgnIJ/uE6AZ4TArj7YVN_9/2Wb-1-TmpAZzs-sM/lnYoqQ',
    title: 'Playful Dog',
    colors: 'from-blue-200 to-cyan-100'
  },
  hard: {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMd6KXcZh26Cy7IhEgnx6knj9St0AYTmW-DA&s',
    title: 'Farm Friends',
    colors: 'from-green-200 to-emerald-100'
  }
};

const JigsawPuzzle = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [pieces, setPieces] = useState([]);
  const [boardPieces, setBoardPieces] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [completionTime, setCompletionTime] = useState(null);
  
  // Try Again counter
  const [tryAgainCount, setTryAgainCount] = useState(0);
  
  // Mouse tracking states
  const [mousePath, setMousePath] = useState([]);
  const [mouseSpeed, setMouseSpeed] = useState([]);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const [lastMouseTime, setLastMouseTime] = useState(null);
  
  // Feedback states
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });
  const [lastPlacedPiece, setLastPlacedPiece] = useState(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState([]);
  
  // Loading state for API calls
  const [isSaving, setIsSaving] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && !completed && startTime) {
      timer = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, completed, startTime]);

  // Mouse tracking effect
  useEffect(() => {
    if (!gameStarted || completed) return;

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const currentPos = { x: e.clientX, y: e.clientY };

      // Record position
      setMousePath(prev => [...prev, { 
        x: e.clientX, 
        y: e.clientY, 
        time: currentTime 
      }]);

      // Calculate speed if we have previous position
      if (lastMousePosition && lastMouseTime) {
        const dx = currentPos.x - lastMousePosition.x;
        const dy = currentPos.y - lastMousePosition.y;
        const dt = currentTime - lastMouseTime;
        
        if (dt > 0) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = distance / dt; // pixels per millisecond
          setMouseSpeed(prev => [...prev, speed]);
        }
      }

      setLastMousePosition(currentPos);
      setLastMouseTime(currentTime);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameStarted, completed, lastMousePosition, lastMouseTime]);

  // Initialize game
  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);

  const initializeGame = (level) => {
    const { rows, cols } = generatePuzzleGrid(level);
    const allPieces = createPuzzlePieces(puzzleImages[level].url, rows, cols);
    
    // Create board positions (empty grid)
    const board = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        board.push({
          id: `board-${row}-${col}`,
          row,
          col,
          piece: null,
          isLocked: false
        });
      }
    }
    
    // Shuffle pieces for play area
    const shuffledPieces = shuffleArray(allPieces).map(piece => ({
      ...piece,
      isPlaced: false,
      isLocked: false,
      currentX: Math.random() * 200 + 50,
      currentY: Math.random() * 200 + 50
    }));
    
    setPieces(shuffledPieces);
    setBoardPieces(board);
    setCompleted(false);
    setShowSuccess(false);
    setGameStarted(true);
    setIncorrectAttempts([]);
    setLastPlacedPiece(null);
    setTryAgainCount(0);
    setStartTime(Date.now());
    setCurrentTime(0);
    setCompletionTime(null);
    setIsSaving(false);
    
    // Reset mouse tracking
    setMousePath([]);
    setMouseSpeed([]);
    setLastMousePosition(null);
    setLastMouseTime(null);
  };

  // Show feedback message
  const showFeedback = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 1500);
  };

  // Check if piece fits in a board position
  const checkPieceFit = (piece, boardPosition) => {
    if (!piece || !boardPosition) return false;
    
    // Check if position is empty and not locked
    if (boardPosition.piece || boardPosition.isLocked) return false;
    
    // Check if this piece belongs here
    return piece.row === boardPosition.row && piece.col === boardPosition.col;
  };

  // Calculate mouse metrics
  const calculateMouseMetrics = () => {
    // Calculate average speed
    const avgSpeed = mouseSpeed.length > 0
      ? mouseSpeed.reduce((a, b) => a + b, 0) / mouseSpeed.length
      : 0;

    // Calculate total path length
    let totalPathLength = 0;
    for (let i = 1; i < mousePath.length; i++) {
      const prev = mousePath[i - 1];
      const curr = mousePath[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      totalPathLength += Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate speed variance (measure of erratic movement)
    let speedVariance = 0;
    if (mouseSpeed.length > 1) {
      const mean = mouseSpeed.reduce((a, b) => a + b, 0) / mouseSpeed.length;
      speedVariance = mouseSpeed.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / mouseSpeed.length;
    }

    return {
      avgSpeed: avgSpeed * 1000, // Convert to pixels per second
      totalPathLength,
      totalPoints: mousePath.length,
      speedVariance,
      avgSpeedRaw: avgSpeed,
      mousePath: mousePath.slice(-100) // Store last 100 points for analysis
    };
  };

  // Save game data to backend
  const saveToBackend = async (timeTaken, mouseMetrics) => {
    setIsSaving(true);
    try {
      const gameData = {
        difficulty,
        pieces: difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 16,
        time: timeTaken,
        tries: tryAgainCount,
        completed: true,
        mouseData: {
          avgSpeed: mouseMetrics.avgSpeed,
          totalPathLength: mouseMetrics.totalPathLength,
          totalPoints: mouseMetrics.totalPoints,
          speedVariance: mouseMetrics.speedVariance,
          mousePath: mouseMetrics.mousePath
        }
      };
      
      await apiService.saveGameSession(gameData);
      console.log('✅ Game session saved to backend successfully');
      
    } catch (error) {
      console.error('❌ Failed to save to backend:', error);
      // Show a subtle notification but don't interrupt the user
      showFeedback('info', 'Game saved locally only');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle dropping a piece on the board
  const handleDropOnBoard = (pieceId, boardId) => {
    const piece = pieces.find(p => p.id === pieceId);
    const boardPos = boardPieces.find(b => b.id === boardId);
    
    if (!piece || !boardPos) return;
    
    // Check if piece is already locked (should not happen, but safety check)
    if (piece.isLocked) return;
    
    if (checkPieceFit(piece, boardPos)) {
      // Correct fit - LOCK the piece in place
      const updatedPieces = pieces.map(p => 
        p.id === pieceId ? { 
          ...p, 
          isPlaced: true, 
          isLocked: true,
          currentX: 0, 
          currentY: 0 
        } : p
      );
      
      const updatedBoard = boardPieces.map(b => 
        b.id === boardId ? { 
          ...b, 
          piece: pieceId,
          isLocked: true
        } : b
      );
      
      setPieces(updatedPieces);
      setBoardPieces(updatedBoard);
      setLastPlacedPiece(pieceId);
      
      // Show success feedback
      showFeedback('success', 'Good Job! ✨');
      
      // Check if puzzle is complete
      const allPlaced = updatedPieces.every(p => p.isPlaced);
      if (allPlaced) {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        setCompletionTime(timeTaken);
        
        // Calculate mouse metrics
        const mouseMetrics = calculateMouseMetrics();
        
        // SAVE STATS TO LOCAL STORAGE with mouse data
        saveGameStats(
          difficulty, 
          timeTaken, 
          tryAgainCount, 
          mouseMetrics
        );
        
        // SAVE TO BACKEND (async - don't await)
        saveToBackend(timeTaken, mouseMetrics);
        
        setCompleted(true);
        setShowSuccess(true);
      }
    } else {
      // Incorrect fit - INCREMENT TRY AGAIN COUNTER
      setTryAgainCount(prev => prev + 1);
      setIncorrectAttempts(prev => [...prev, { pieceId, boardId, time: Date.now() }]);
      showFeedback('error', 'Try Again! 🔄');
      
      // Visual feedback - highlight the piece and board
      setTimeout(() => {
        setIncorrectAttempts(prev => 
          prev.filter(attempt => attempt.time !== Date.now())
        );
      }, 1000);
    }
  };

  // Handle removing a piece from board - ONLY for unlocked pieces
  const handleRemoveFromBoard = (boardId) => {
    const boardPos = boardPieces.find(b => b.id === boardId);
    if (!boardPos || !boardPos.piece) return;
    
    const pieceId = boardPos.piece;
    const piece = pieces.find(p => p.id === pieceId);
    
    // If piece is locked, don't allow removal
    if (piece?.isLocked) {
      showFeedback('info', 'This piece is locked! 🔒');
      return;
    }
    
    const updatedPieces = pieces.map(p => 
      p.id === pieceId ? { 
        ...p, 
        isPlaced: false,
        isLocked: false,
        currentX: Math.random() * 200 + 50,
        currentY: Math.random() * 200 + 50
      } : p
    );
    
    const updatedBoard = boardPieces.map(b => 
      b.id === boardId ? { 
        ...b, 
        piece: null,
        isLocked: false 
      } : b
    );
    
    setPieces(updatedPieces);
    setBoardPieces(updatedBoard);
    
    // Show feedback for removal
    showFeedback('info', 'Piece unlocked');
  };

  // Update piece position while dragging (only for unlocked pieces)
  const updatePiecePosition = (pieceId, x, y) => {
    setPieces(prev => prev.map(p => 
      p.id === pieceId && !p.isLocked ? { ...p, currentX: x, currentY: y } : p
    ));
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${puzzleImages[difficulty].colors} p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Timer and Try Again Counter */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <span className="mr-3">🧩</span>
            Jigsaw Puzzle
            <span className="ml-3">🧩</span>
          </h1>
          <p className="text-xl text-gray-600">
            {puzzleImages[difficulty].title} - Drag pieces to their spots!
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="text-gray-600 mr-2">⏱️</span>
              <span className="font-bold text-purple-600">{formatTime(currentTime)}</span>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="text-gray-600 mr-2">🔄</span>
              <span className="font-bold text-orange-600">{tryAgainCount}</span>
              <span className="text-gray-500 text-sm ml-1">tries</span>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="text-gray-600 mr-2">🧩</span>
              <span className="font-bold text-green-600">
                {pieces.filter(p => p.isPlaced).length}/{pieces.length}
              </span>
            </div>
          </div>

          {/* Mouse Stats (Optional - can be hidden) */}
          {mousePath.length > 100 && (
            <div className="text-xs text-gray-500 mt-2">
              Mouse points tracked: {mousePath.length}
              {isSaving && <span className="ml-2 text-blue-500">💾 Saving...</span>}
            </div>
          )}
        </motion.div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <PuzzleControls
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              onReset={() => initializeGame(difficulty)}
              gameStarted={gameStarted}
              piecesPlaced={pieces.filter(p => p.isPlaced).length}
              totalPieces={pieces.length}
              currentTime={currentTime}
              tryAgainCount={tryAgainCount}
              formatTime={formatTime}
            />
          </div>

          {/* Game Area - Board + Pieces */}
          <div className="lg:col-span-3 space-y-6">
            {/* Puzzle Board */}
            <PuzzleBoard
              boardPieces={boardPieces}
              pieces={pieces}
              onDrop={handleDropOnBoard}
              onRemove={handleRemoveFromBoard}
              difficulty={difficulty}
              imageUrl={puzzleImages[difficulty].url}
              lastPlacedPiece={lastPlacedPiece}
              incorrectAttempts={incorrectAttempts}
            />

            {/* Available Pieces - Only show unlocked pieces */}
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🧩</span>
                Pieces to Place ({pieces.filter(p => !p.isPlaced && !p.isLocked).length})
              </h3>
              
              <div className="flex flex-wrap gap-4 min-h-[150px] p-4 bg-white bg-opacity-30 rounded-xl">
                <AnimatePresence>
                  {pieces
                    .filter(p => !p.isPlaced && !p.isLocked)
                    .map((piece, index) => (
                      <PuzzlePiece
                        key={piece.id}
                        piece={piece}
                        index={index}
                        onDrag={updatePiecePosition}
                        onDrop={handleDropOnBoard}
                        difficulty={difficulty}
                        imageUrl={puzzleImages[difficulty].url}
                        isLocked={false}
                      />
                    ))}
                </AnimatePresence>
                
                {pieces.filter(p => !p.isPlaced && !p.isLocked).length === 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full text-center py-8 text-green-600 font-bold text-xl"
                  >
                    ✨ All pieces placed! Great job! ✨
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback.show && (
            <FeedbackMessage type={feedback.type} message={feedback.message} />
          )}
        </AnimatePresence>

        {/* Success Celebration with Stats */}
        <AnimatePresence>
          {showSuccess && (
            <PuzzleSuccess
              difficulty={difficulty}
              onPlayAgain={() => initializeGame(difficulty)}
              onNextLevel={() => {
                const nextLevel = 
                  difficulty === 'easy' ? 'medium' : 
                  difficulty === 'medium' ? 'hard' : 'easy';
                setDifficulty(nextLevel);
              }}
              imageUrl={puzzleImages[difficulty].url}
              completionTime={completionTime}
              tryAgainCount={tryAgainCount}
              formatTime={formatTime}
            />
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-2">1️⃣</span>
              <span>Drag unlocked pieces</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">2️⃣</span>
              <span>Drop on matching spot</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">3️⃣</span>
              <span>Green = Locked! Red = Try Again!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JigsawPuzzle;