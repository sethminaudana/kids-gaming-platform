// src/Game.jsx

import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import Header from "./Header";

// --- Game Configuration ---
const NUM_GEMS = 6; // Total number of gems on screen
const STARTING_LEVEL = 3; // Initial sequence length
const MISTAKES_ALLOWED = 1; // Tries per level (1 mistake means 2 tries total)

const Game = () => {
  // --- Game State Management ---
  // FIX: Added state variable and setter names
  const [gameState, setGameState] = useState("start"); // 'start', 'watching', 'playing', 'feedback', 'gameover'
  const [level, setLevel] = useState(STARTING_LEVEL);
  // FIX: Added state variable and setter names, with initial value
  const [sequence, setSequence] = useState([]);
  // FIX: Added state variable and setter names, with initial value
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeGem, setActiveGem] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // --- Data Collection State ---
  // FIX: Added state variable and setter names, with initial value
  const [sessionData, setSessionData] = useState([]);
  const roundStartTime = useRef(null);

  // --- Core Data Logging Function ---
  // This function is essential for your research. It captures every event.
  const logData = (eventType, eventDetails) => {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      level,
      ...eventDetails,
    };
    // FIX: Completed the setter function to add the new event to the array
    setSessionData((prevData) => [...prevData, event]);
  };

  // --- Game Logic Functions ---
  const startNewRound = () => {
    setGameState("watching");
    // FIX: Provided an empty array to reset the player sequence
    setPlayerSequence([]);

    const newSequence = Array.from({ length: level }, () =>
      Math.floor(Math.random() * NUM_GEMS)
    );
    setSequence(newSequence);

    logData("round_start", { sequence: newSequence });
  };

  const handleStartGame = () => {
    // FIX: Provided an empty array to clear previous session data
    setSessionData([]);
    logData("game_start", {});
    setLevel(STARTING_LEVEL);
    setMistakes(0);
    startNewRound();
  };

  // Effect to display the sequence to the player
  useEffect(() => {
    if (gameState === "watching") {
      const displayInterval = 800; // Time each gem is lit
      const pauseInterval = 400; // Pause between gems

      let i = 0;
      const interval = setInterval(() => {
        setActiveGem(sequence[i]);
        setTimeout(() => setActiveGem(null), displayInterval); // Turn off after display time
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setGameState("playing");
            roundStartTime.current = Date.now(); // Start timer for player response
            logData("sequence_displayed", { sequence });
          }, displayInterval + pauseInterval);
        }
      }, displayInterval + pauseInterval);

      return () => clearInterval(interval);
    }
    // FIX: Added dependency array. Effect runs when gameState or sequence changes.
  }, [gameState, sequence]);

  // Handle player's click on a gem
  const handleGemClick = (gemIndex) => {
    // FIX: Corrected typo '!=='
    if (gameState !== "playing") return;

    const responseTime = Date.now() - roundStartTime.current;

    // LOGIC FIX: Check if the clicked gem (gemIndex) matches the
    // correct gem in the sequence at the player's current position.
    const isCorrect = sequence[playerSequence.length] === gemIndex;

    // FIX: Completed the array update
    const newPlayerSequence = [...playerSequence, gemIndex];
    setPlayerSequence(newPlayerSequence);

    logData("player_tap", {
      tappedGem: gemIndex,
      isCorrect,
      sequencePosition: playerSequence.length, // Note: this is the *old* length (0-indexed position)
      responseTime,
    });

    // Check if the entire sequence is now complete
    if (newPlayerSequence.length === sequence.length) {
      setGameState("feedback");
      if (isCorrect) {
        // --- Round Success ---
        setFeedbackMessage("Great job!");
        logData("round_success", { playerSequence: newPlayerSequence });
        setTimeout(() => {
          setLevel((prevLevel) => prevLevel + 1);
          setMistakes(0);
          startNewRound();
        }, 1500);
      } else {
        // --- Round Failure (on the very last tap) ---
        handleMistake(newPlayerSequence);
      }
    } else if (!isCorrect) {
      // --- Mistake mid-sequence ---
      setGameState("feedback");
      handleMistake(newPlayerSequence);
    }
  };

  const handleMistake = (finalPlayerSequence) => {
    logData("round_fail", {
      playerSequence: finalPlayerSequence,
      mistakesMade: mistakes + 1,
    });

    if (mistakes < MISTAKES_ALLOWED) {
      setMistakes(mistakes + 1);
      setFeedbackMessage("Oops! Watch again.");
      setTimeout(() => {
        // FIX: Provided an empty array to reset player sequence for the retry
        setPlayerSequence([]);
        setGameState("watching"); // Re-watch the same sequence
      }, 2000);
    } else {
      setFeedbackMessage("Game Over");
      setGameState("gameover");
      logData("game_over", { finalScore: level - 1 });
      // In a real application, you would send the data to your server here.
      // For now, we log it to the console to show the collected data.
      console.log("--- FINAL RESEARCH DATA ---");
      console.log(JSON.stringify(sessionData, null, 2));
    }
  };

  // --- Render Logic ---
  return (
    <>
      <div className="game-container">
        <h1>Magic Gems</h1>
        <div className="game-board">
          {Array.from({ length: NUM_GEMS }).map((_, index) => (
            <div
              key={index}
              // FIX: Corrected typo '!==' and cleaned up spacing
              className={`gem gem-${index} ${
                activeGem === index ? "active" : ""
              } ${gameState !== "playing" ? "disabled" : ""}`}
              onClick={() => handleGemClick(index)}
            ></div>
          ))}
        </div>

        <div className="status-container">
          {gameState === "start" && (
            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          )}

          {gameState === "watching" && (
            <p className="status-text">Watch the magic gems!</p>
          )}
          {gameState === "playing" && <p className="status-text">Your turn!</p>}

          {gameState === "feedback" && (
            <p className="status-text feedback">{feedbackMessage}</p>
          )}

          {gameState === "gameover" && (
            <div className="gameover-screen">
              <h2>Game Over</h2>
              <p>You reached level {level - 1}!</p>
              <button className="start-button" onClick={handleStartGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
