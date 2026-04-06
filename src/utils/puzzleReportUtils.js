// src/utils/puzzleReportUtils.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Format time as MM:SS
export const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate performance rating based on tries and time
export const getPerformanceRating = (tries, timeSeconds, difficulty) => {
  const pieceCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 16;
  
  // Expected ranges based on difficulty
  const expectedTime = {
    easy: { good: 30, average: 60, needsPractice: 90 },
    medium: { good: 90, average: 180, needsPractice: 300 },
    hard: { good: 180, average: 300, needsPractice: 480 }
  };
  
  const expectedTries = {
    easy: { good: 2, average: 5, needsPractice: 10 },
    medium: { good: 5, average: 12, needsPractice: 20 },
    hard: { good: 10, average: 20, needsPractice: 35 }
  };
  
  // Calculate time score
  let timeScore = 3; // 3 = needsPractice
  if (timeSeconds <= expectedTime[difficulty].good) timeScore = 1; // good
  else if (timeSeconds <= expectedTime[difficulty].average) timeScore = 2; // average
  
  // Calculate tries score
  let triesScore = 3;
  if (tries <= expectedTries[difficulty].good) triesScore = 1;
  else if (tries <= expectedTries[difficulty].average) triesScore = 2;
  
  // Combined score
  const combinedScore = (timeScore + triesScore) / 2;
  
  if (combinedScore <= 1.5) return { rating: 'Excellent! 🌟', color: '#10b981', emoji: '🏆' };
  if (combinedScore <= 2.3) return { rating: 'Good Job! 👍', color: '#3b82f6', emoji: '⭐' };
  return { rating: 'Keep Practicing! 💪', color: '#f59e0b', emoji: '🎯' };
};

// Generate PDF report
export const generatePDFReport = (gameStats, childName = 'My Child') => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [139, 92, 246]; // Purple
  const secondaryColor = [236, 72, 153]; // Pink
  const successColor = [16, 185, 129]; // Green
  const warningColor = [245, 158, 11]; // Orange
  
  // Title
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('🧩 Puzzle Progress Report', 105, 25, { align: 'center' });
  
  // Child name and date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Child: ${childName}`, 20, 55);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 75);
  
  // Summary stats
  let totalTime = 0;
  let totalTries = 0;
  let totalPieces = 0;
  
  gameStats.forEach(stat => {
    totalTime += stat.time || 0;
    totalTries += stat.tries || 0;
    totalPieces += stat.pieces || 0;
  });
  
  // Summary boxes
  const summaryY = 90;
  
  // Time box
  doc.setFillColor(230, 240, 255);
  doc.roundedRect(20, summaryY, 55, 35, 3, 3, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(formatTime(totalTime), 47, summaryY + 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Total Time', 47, summaryY + 30, { align: 'center' });
  
  // Tries box
  doc.setFillColor(255, 240, 240);
  doc.roundedRect(80, summaryY, 55, 35, 3, 3, 'F');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(totalTries.toString(), 107, summaryY + 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Total Tries', 107, summaryY + 30, { align: 'center' });
  
  // Pieces box
  doc.setFillColor(240, 255, 240);
  doc.roundedRect(140, summaryY, 55, 35, 3, 3, 'F');
  doc.setTextColor(successColor[0], successColor[1], successColor[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(totalPieces.toString(), 167, summaryY + 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Total Pieces', 167, summaryY + 30, { align: 'center' });
  
  // Table headers
  const tableY = summaryY + 45;
  
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(20, tableY, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Level', 25, tableY + 7);
  doc.text('Pieces', 60, tableY + 7);
  doc.text('Time', 95, tableY + 7);
  doc.text('Try Again', 130, tableY + 7);
  doc.text('Rating', 165, tableY + 7);
  
  // Table rows
  let rowY = tableY + 10;
  const rowHeight = 12;
  
  gameStats.forEach((stat, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, rowY - 3, 170, rowHeight, 'F');
    }
    
    const rating = getPerformanceRating(stat.tries, stat.time, stat.level);
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text(stat.level.charAt(0).toUpperCase() + stat.level.slice(1), 25, rowY + 3);
    doc.text(stat.pieces.toString(), 60, rowY + 3);
    doc.text(formatTime(stat.time), 95, rowY + 3);
    doc.text(stat.tries.toString(), 130, rowY + 3);
    
    // Rating with emoji
    doc.setTextColor(rating.color.split('#')[1] ? parseInt(rating.color.slice(1), 16) : 0);
    doc.text(`${rating.emoji} ${rating.rating}`, 165, rowY + 3, { align: 'center' });
    
    rowY += rowHeight;
  });
  
  // Achievement badges
  const badgeY = rowY + 15;
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, badgeY - 5, 190, badgeY - 5);
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🏆 Achievements', 20, badgeY);
  
  // Calculate achievements
  let achievements = [];
  
  if (gameStats.some(s => s.tries <= 2 && s.level === 'easy')) {
    achievements.push({ emoji: '⭐', text: 'Easy Level Master - 2 or fewer tries!' });
  }
  if (gameStats.some(s => s.tries <= 5 && s.level === 'medium')) {
    achievements.push({ emoji: '🌟', text: 'Medium Level Champion - 5 or fewer tries!' });
  }
  if (gameStats.some(s => s.tries <= 10 && s.level === 'hard')) {
    achievements.push({ emoji: '👑', text: 'Hard Level Legend - 10 or fewer tries!' });
  }
  
  if (totalTime < 300) {
    achievements.push({ emoji: '⚡', text: 'Speed Demon - Completed all in under 5 minutes!' });
  }
  
  if (achievements.length === 0) {
    achievements.push({ emoji: '🎯', text: 'Keep playing to earn achievements!' });
  }
  
  let achievementY = badgeY + 10;
  achievements.forEach(ach => {
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${ach.emoji} ${ach.text}`, 25, achievementY);
    achievementY += 7;
  });
  
  // Encouragement message
  const footerY = achievementY + 15;
  
  doc.setFillColor(255, 255, 200);
  doc.roundedRect(20, footerY, 170, 25, 3, 3, 'F');
  doc.setTextColor(100, 80, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('✨ Every puzzle you solve makes your brain stronger!', 105, footerY + 10, { align: 'center' });
  doc.text('Keep playing and having fun! 🧩', 105, footerY + 18, { align: 'center' });
  
  // Save the PDF
  doc.save(`puzzle-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Track mouse movements during play



const handleMouseMove = (e) => {
  // Record position with timestamp
  setMousePath(prev => [...prev, { x: e.clientX, y: e.clientY, time: Date.now() }]);
};

// Calculate metrics at end of level
const calculateMouseMetrics = () => {
  if (mousePath.length < 2) return {};
  
  let totalDistance = 0;
  let speedSum = 0;
  
  for (let i = 1; i < mousePath.length; i++) {
    const dx = mousePath[i].x - mousePath[i-1].x;
    const dy = mousePath[i].y - mousePath[i-1].y;
    const dt = mousePath[i].time - mousePath[i-1].time;
    const distance = Math.sqrt(dx*dx + dy*dy);
    totalDistance += distance;
    if (dt > 0) speedSum += distance / dt;
  }
  
  const avgSpeed = speedSum / (mousePath.length - 1);
  const pathEfficiency = totalDistance / (optimalPathLength); // need optimal path
  
  return { avgSpeed, pathEfficiency, totalDistance };
};


// Get all game statistics
export const getGameStats = () => {
  return JSON.parse(localStorage.getItem('puzzleGameStats') || '[]');
};

// Clear statistics
export const clearGameStats = () => {
  localStorage.removeItem('puzzleGameStats');
};

// src/utils/puzzleReportUtils.js
export const saveGameStats = (difficulty, time, tries, mouseData = {}) => {
  const stats = JSON.parse(localStorage.getItem('puzzleGameStats') || '[]');
  
  const newStat = {
    level: difficulty,
    pieces: difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 16,
    time,
    tries,
    date: new Date().toISOString(),
    mouseData: {
      avgSpeed: mouseData.avgSpeed || 0,
      totalPathLength: mouseData.totalPathLength || 0,
      totalPoints: mouseData.totalPoints || 0,
      avgSpeedRaw: mouseData.avgSpeedRaw || 0
    }
  };
  
  stats.push(newStat);
  if (stats.length > 20) stats.shift();
  localStorage.setItem('puzzleGameStats', JSON.stringify(stats));
  return stats;
};

// Helper function to interpret mouse data
export const getMouseBehaviorRating = (avgSpeed, totalPathLength, pieces) => {
  // Expected path length based on pieces (rough estimate)
  const expectedPathLength = pieces * 300; // pixels
  const pathEfficiency = totalPathLength / expectedPathLength;
  
  // Speed thresholds (pixels per second)
  const speedThresholds = {
    slow: 200,
    normal: 400,
    fast: 600,
    veryFast: 800
  };
  
  let speedRating = 'normal';
  let speedColor = '#3b82f6';
  let speedEmoji = '⚡';
  
  if (avgSpeed < speedThresholds.slow) {
    speedRating = 'very slow';
    speedColor = '#f59e0b';
    speedEmoji = '🐢';
  } else if (avgSpeed < speedThresholds.normal) {
    speedRating = 'slow';
    speedColor = '#f97316';
    speedEmoji = '🐢';
  } else if (avgSpeed < speedThresholds.fast) {
    speedRating = 'normal';
    speedColor = '#3b82f6';
    speedEmoji = '⚡';
  } else if (avgSpeed < speedThresholds.veryFast) {
    speedRating = 'fast';
    speedColor = '#8b5cf6';
    speedEmoji = '🚀';
  } else {
    speedRating = 'very fast';
    speedColor = '#ec4899';
    speedEmoji = '⚡⚡';
  }
  
  // Path efficiency rating
  let efficiencyRating = 'normal';
  let efficiencyColor = '#3b82f6';
  let efficiencyEmoji = '📏';
  
  if (pathEfficiency < 0.5) {
    efficiencyRating = 'very efficient';
    efficiencyColor = '#10b981';
    efficiencyEmoji = '🎯';
  } else if (pathEfficiency < 0.8) {
    efficiencyRating = 'efficient';
    efficiencyColor = '#34d399';
    efficiencyEmoji = '✅';
  } else if (pathEfficiency < 1.2) {
    efficiencyRating = 'normal';
    efficiencyColor = '#3b82f6';
    efficiencyEmoji = '📏';
  } else if (pathEfficiency < 1.8) {
    efficiencyRating = 'wandering';
    efficiencyColor = '#f97316';
    efficiencyEmoji = '🌀';
  } else {
    efficiencyRating = 'very wandering';
    efficiencyColor = '#ef4444';
    efficiencyEmoji = '🌪️';
  }
  
  return {
    speed: { rating: speedRating, color: speedColor, emoji: speedEmoji, value: avgSpeed },
    efficiency: { rating: efficiencyRating, color: efficiencyColor, emoji: efficiencyEmoji, value: pathEfficiency }
  };
};
