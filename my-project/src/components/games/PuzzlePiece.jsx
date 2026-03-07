// src/components/games/PuzzlePiece.jsx
import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Lock } from 'lucide-react';

const PuzzlePiece = ({ piece, index, onDrag, onDrop, difficulty, imageUrl, isLocked }) => {
  const pieceRef = useRef(null);
  const dragControls = useDragControls();

  // Get edge style based on piece edges
  const getEdgeStyle = () => {
    return {
      clipPath: getClipPath(),
      border: 'none'
    };
  };

  // Generate clip path for interlocking tabs and blanks
  const getClipPath = () => {
    const size = 100;
    const tabSize = 15;
    const blankSize = 15;
    
    let path = `M 0 0 `;
    
    // Top edge
    if (piece.top === 'tab') {
      path += `L ${size/2 - tabSize} 0 `;
      path += `Q ${size/2} -${tabSize} ${size/2 + tabSize} 0 `;
    } else if (piece.top === 'blank') {
      path += `L ${size/2 - blankSize} 0 `;
      path += `Q ${size/2} ${blankSize} ${size/2 + blankSize} 0 `;
    }
    path += `L ${size} 0 `;
    
    // Right edge
    if (piece.right === 'tab') {
      path += `L ${size} ${size/2 - tabSize} `;
      path += `Q ${size + tabSize} ${size/2} ${size} ${size/2 + tabSize} `;
    } else if (piece.right === 'blank') {
      path += `L ${size} ${size/2 - blankSize} `;
      path += `Q ${size - blankSize} ${size/2} ${size} ${size/2 + blankSize} `;
    }
    path += `L ${size} ${size} `;
    
    // Bottom edge
    if (piece.bottom === 'tab') {
      path += `L ${size/2 + tabSize} ${size} `;
      path += `Q ${size/2} ${size + tabSize} ${size/2 - tabSize} ${size} `;
    } else if (piece.bottom === 'blank') {
      path += `L ${size/2 + blankSize} ${size} `;
      path += `Q ${size/2} ${size - blankSize} ${size/2 - blankSize} ${size} `;
    }
    path += `L 0 ${size} `;
    
    // Left edge
    if (piece.left === 'tab') {
      path += `L 0 ${size/2 + tabSize} `;
      path += `Q ${-tabSize} ${size/2} 0 ${size/2 - tabSize} `;
    } else if (piece.left === 'blank') {
      path += `L 0 ${size/2 + blankSize} `;
      path += `Q ${blankSize} ${size/2} 0 ${size/2 - blankSize} `;
    }
    
    path += `L 0 0`;
    
    return path;
  };

  // Handle drag start - only if piece is not locked
  const handleDragStart = (e) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('pieceId', piece.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    if (isLocked) return;
    const x = e.clientX;
    const y = e.clientY;
    onDrag(piece.id, x, y);
  };

  const sizeClasses = {
    easy: 'w-32 h-32',
    medium: 'w-24 h-24',
    hard: 'w-20 h-20'
  };

  return (
    <motion.div
      ref={pieceRef}
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={!isLocked ? { scale: 1.1, zIndex: 10 } : {}}
      whileDrag={!isLocked ? { scale: 1.2, zIndex: 20, opacity: 0.8 } : {}}
      dragControls={dragControls}
      className={`
        ${sizeClasses[difficulty]}
        relative transition-all duration-200
        bg-cover bg-no-repeat
        ${isLocked 
          ? 'opacity-100 cursor-default' 
          : 'cursor-grab active:cursor-grabbing hover:shadow-2xl'}
        shadow-lg
      `}
      style={{
        ...getEdgeStyle(),
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${difficulty === 'easy' ? '322%' : 
                         difficulty === 'medium' ? '300%' : '320%'}`,
        backgroundPosition: `${piece.col * 50}% ${piece.row * 50}%`,
        filter: isLocked 
          ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.05)' 
          : 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))'
      }}
    >
      {/* Edge highlights */}
      <div className="absolute inset-0 opacity-20">
        {piece.top !== 'flat' && (
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 
            ${piece.top === 'tab' ? 'bg-purple-300' : 'bg-blue-300'} rounded-full`} />
        )}
        {piece.right !== 'flat' && (
          <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 
            ${piece.right === 'tab' ? 'bg-purple-300' : 'bg-blue-300'} rounded-full`} />
        )}
      </div>
      
      {/* Piece number - green if locked */}
      <div className={`absolute bottom-1 right-1 w-5 h-5 
        ${isLocked ? 'bg-green-600' : 'bg-purple-600'} 
        bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs font-bold z-10`}>
        {index + 1}
      </div>
      
      {/* Lock indicator for locked pieces */}
      {isLocked && (
        <div className="absolute top-1 left-1 bg-green-600 text-white p-1 rounded-full z-10">
          <Lock className="w-3 h-3" />
        </div>
      )}
      
      {/* Drag handle indicator - only if not locked */}
      {!isLocked && (
        <div className="absolute top-1 left-1 w-4 h-4 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
          <span className="text-xs">⣿</span>
        </div>
      )}
    </motion.div>
  );
};

export default PuzzlePiece;