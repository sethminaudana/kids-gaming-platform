import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Game from './components/Game/Game';
import EyeTracker from './components/EyeTracker/EyeTracker';
import Dashboard from './components/Dashboard/Dashboard';
import { sendDataToBackend } from './utils/api';

function App() {
  const [attentionData, setAttentionData] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const dataCollectionInterval = useRef(null);

  useEffect(() => {
    // Generate session ID
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    
    return () => {
      if (dataCollectionInterval.current) {
        clearInterval(dataCollectionInterval.current);
      }
    };
  }, []);

  const startTracking = () => {
    setIsTracking(true);
    
    // Start collecting data every 2 seconds
    dataCollectionInterval.current = setInterval(() => {
      if (gameData.length > 0 && attentionData.length > 0) {
        const combinedData = {
          sessionId,
          timestamp: Date.now(),
          gameData: gameData[gameData.length - 1],
          attentionData: attentionData[attentionData.length - 1],
          metadata: {
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
          }
        };
        
        // Send to backend
        sendDataToBackend(combinedData);
      }
    }, 2000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (dataCollectionInterval.current) {
      clearInterval(dataCollectionInterval.current);
    }
  };

  const handleGameUpdate = (data) => {
    setGameData(prev => [...prev, data]);
  };

  const handleAttentionUpdate = (data) => {
    setAttentionData(prev => [...prev, data]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Attention Detection Game</h1>
        <p>Help Flippy the Fish while we analyze your attention patterns</p>
      </header>

      <div className="main-container">
        <div className="left-panel">
          <Game 
            onGameUpdate={handleGameUpdate} 
            sessionId={sessionId}
          />
        </div>

        <div className="right-panel">
          <EyeTracker 
            onAttentionUpdate={handleAttentionUpdate}
            isTracking={isTracking}
          />
          
          <Dashboard 
            gameData={gameData}
            attentionData={attentionData}
            isTracking={isTracking}
            onStartTracking={startTracking}
            onStopTracking={stopTracking}
          />
        </div>
      </div>

      <div className="data-status">
        <p>Session ID: {sessionId}</p>
        <p>Data Points Collected: {gameData.length}</p>
        <p>Status: {isTracking ? 'Tracking Active' : 'Tracking Inactive'}</p>
      </div>
    </div>
  );
}

export default App;