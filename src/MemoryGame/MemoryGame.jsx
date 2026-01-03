import React, { useState, useEffect, useRef } from 'react';
import './memorygame.css';
// Add ?url to imports
import right from './right_answer.wav?url';
import wrong from './wrong_answer.mp3?url';
import congrats from '../assets/congratulations.wav?url';
// Updated import to match the component file name
import Tutorial from './Tutorial'; 
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

// Make sure this function is outside the component
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const MemoryGame = () => {
    const [cards, setCards] = useState(createDeck()); // Make settable for restart
    const [startGame, setStartGame] = useState(false);
    const [closeTut, setCloseTut] = useState(true);
    const [flippedIndexes, setFlippedIndexes] = useState([]);
    const [matchedIndexes, setMatchedIndexes] = useState([]);
    const [rightMatches, setRightMatches] = useState([]);
    const [wrongMatches, setWrongMatches] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [winner, setWinner] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // --- DATA COLLECTION REFS (New) ---
    const eventLog = useRef([]); // Stores the raw timeline of events
    const lastClickTime = useRef(Date.now()); // To calculate Inter-Click Interval
    const isProcessing = useRef(false); // To track if board is locked (for invalid clicks)


    // Use useState to create audio objects only once
    const [correctAudio] = useState(new Audio(right));
    const [wrongAudio] = useState(new Audio(wrong));
    const [winning] = useState(new Audio(congrats));

    function createDeck() {
        const symbols = ['🍎', '🍌', '🍉', '🍇', '🥑', '🍓', '🍊', '🍍'];
        const deck = symbols.concat(symbols);
        return shuffle(deck.map((symbol, index) => ({ symbol, index })));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

     // --- HELPER: Log an event to the array (New) ---
     function logEvent(type, details = {}) {
        const now = Date.now();
        const timeDiff = now - lastClickTime.current;
        lastClickTime.current = now;

        eventLog.current.push({
            timestamp: now,
            eventType: type,
            timeSinceLastAction: timeDiff,
            ...details
        });
    }

    function handleClose() {
        setCloseTut(!closeTut);
    }

    function handleStart() {
        // Don't send data on the first start, only on restart
        if (startGame) {
             sendDatatoserver(); // Send data from the *previous* game
        }
        setStartGame(true); // Always set to true
        restartGame(false); // Pass false to not send data
        // Log Game Start
        logEvent('game_start', { deckSize: cards.length });
    }

    const contentRef = useRef(null);
    useEffect(() => {
        if (startGame && contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [startGame]);

   // Updated handleCardClick to accept the 'e' (event) object
   function handleCardClick(index, e) {
    // 1. CAPTURE CLICK COORDINATES (For Spatial Analysis)
    const clickDetails = {
        cardIndex: index,
        cardSymbol: cards[index].symbol,
        x: e ? e.clientX : 0,
        y: e ? e.clientY : 0
    };

    // 2. CHECK FOR INVALID CLICKS (Impulsivity / Hyperactivity)
    // If board is processing (waiting for timeout) or card already flipped/matched
    if (isProcessing.current || matchedIndexes.includes(index) || flippedIndexes.includes(index)) {
        logEvent('invalid_click', {
            ...clickDetails,
            reason: isProcessing.current ? 'board_locked' : 'card_already_active'
        });
        return;
    }

    // 3. LOG VALID CLICK
    logEvent('card_flip', clickDetails);

    // Standard Logic
    if (flippedIndexes.length === 0) {
        setFlippedIndexes([index]);
    } else if (flippedIndexes.length === 1) {
        const firstIndex = flippedIndexes[0];
        setFlippedIndexes([firstIndex, index]); // Show both cards
        
        isProcessing.current = true; // LOCK BOARD
        setTimeout(() => checkForMatch(firstIndex, index), 1000);
    }
}

    function checkForMatch(firstIndex, secondIndex) {
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];
        const isMatch = firstCard.symbol === secondCard.symbol;

        // Log the result of the attempt
        logEvent(isMatch ? 'match_found' : 'mismatch', {
            cardA: firstIndex,
            cardB: secondIndex,
            symbol: firstCard.symbol
        });

        if (isMatch) {
            setMatchedIndexes(prev => [...prev, firstIndex, secondIndex]);
            setRightMatches(prev => [...prev, firstIndex, secondIndex]);
            correctAudio.play();
        } else {
            setWrongMatches(prev => [...prev, firstIndex, secondIndex]);
            wrongAudio.play();
        }

        setFlippedIndexes([]); // Flip both back
        isProcessing.current = false; // UNLOCK BOARD
    }

    function restartGame(shouldSendData = true) {
        if (shouldSendData) {
            sendDatatoserver();
        }
        setCards(createDeck()); // Get a new shuffled deck
        setFlippedIndexes([]);
        setMatchedIndexes([]);
        setRightMatches([]);
        setWrongMatches([]);
        setElapsedTime(0);
        setWinner(false);
        setGameOver(false); // Reset game over

        // Reset Logs
        eventLog.current = [];
        lastClickTime.current = Date.now();
        isProcessing.current = false;

        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if (startGame && !gameOver) { // Only tick if game started and not over
                setElapsedTime(prevTime => prevTime + 1);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [startGame, gameOver]); // Add startGame to dependencies

    useEffect(() => {
        if (rightMatches.length > 0 && rightMatches.length / 2 === 8) {
            setWinner(true);
            setGameOver(true); // Set game over state to true
            winning.play();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [rightMatches, winning]); // removed 'winner' from deps

    function sendDatatoserver(){
        // Only send if there's actually data to send
        if (rightMatches.length === 0 && wrongMatches.length === 0) return;

        const sendData = async () => {
            try {
                // Change fetch path to be relative for the proxy
                const response = await fetch('/api/memorygame', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rightMatches: rightMatches.length / 2,
                        wrongMatches: wrongMatches.length / 2,
                        timetaken: elapsedTime,
                        events: eventLog.current // SEND THE FULL EVENT LOG
                    }),
                });
                const responseData = await response.json();
                // --- NEW: DISPLAY THE ALERT ---
                if (responseData.report) {
                    // This pops up the browser alert with the Python output
                    alert(responseData.report);
                }
                console.log('Response from server:', responseData.score);
            } catch (error) {
                console.error('Error sending data:', error);
            }
        };
        sendData();
    }
    
    useEffect(() => {
        if(winner){
            sendDatatoserver();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winner]); // 'winner' is the only dependency needed here

    return (
        <div className='container-fluid' style={{backgroundColor: `#440455`}}>
            <div className='row p-5'>
                {/* ... (rest of your JSX is fine) ... */}
                <hr style={{color: `white`}}/>
                <h1 className='text-white hanoi-title' style={{fontSize: `5rem`}}>CARD FLIP GAME</h1>
                <hr style={{color: `white`}}/>
                <div className='col-md-9'>
                    <div className="p-2" style={{color: `rgb(225, 187, 245)`, fontSize: `1.2em`}}>
                        The card flip game is a variation of the classic memory game...
                        <br/><br/>
                        Benefits of this game for individuals with ADHD : <br/><br/>
                        🌟 <span className='px-2' style={{fontSize: `1.2em`, textShadow: `0 0 3px #fff`, color: `yellow`}}>Memory</span> <br/>
                        🌟 <span className='px-2' style={{fontSize: `1.2em`, textShadow: `0 0 3px #fff`, color: `yellow`}}>Focus and Attention</span> <br/>
                        🌟 <span className='px-2' style={{fontSize: `1.2em`, textShadow: `0 0 3px #fff`, color: `yellow`}}>Hyperactivity Regulation</span> <br/>
                        <br/>
                        However, as with any activity, its suitability may vary...
                    </div>
                    <button className="btn btn-warning m-2" onClick={handleStart} style={{fontSize: `1.2em`}}>{startGame ? 'RESTART GAME' : 'START GAME'}</button>
                    <button className="btn btn-warning m-2" onClick={handleClose} style={{fontSize: `1.2em`}}>SEE TUTORIAL</button> 
                </div>
            </div>
            {!closeTut && <Tutorial  onClose={handleClose}/>}
            { startGame && <div className="memory-game" ref={contentRef}>
                <div className="cards-grid">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`card ${flippedIndexes.includes(index) || matchedIndexes.includes(index) ? 'flipped' : ''}`}
                            // Pass the event 'e' to the handler
                            onClick={(e) => handleCardClick(index, e)}
                        >
                            {flippedIndexes.includes(index) || matchedIndexes.includes(index) ? card.symbol : '💡💭'}
                        </div>
                    ))}
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, transition: 'transform 0.2s'}} onClick={() => restartGame(true)}>Restart Game</button>
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, cursor: `default`, transition: 'transform 0.2s'}}>✅ {rightMatches.length/2}</button>
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, cursor: `default`, transition: 'transform 0.2s'}}>❌ {wrongMatches.length/2}</button>
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, cursor: `default`, transition: 'transform 0.2s'}}>⏰ {formatTime(elapsedTime)}</button>
                </div>
            </div>}
            {winner && (
                <div className="overlay">
                    <Confetti />
                <div className="win-message">
                    CONGRATULATIONS!
                <div className="win-subtitle">
                    You are on the go!
                </div>
                <div className="win-subtitle p-1" style={{fontSize: `0.45em`}}>
                    There is no ideal solution to this since luck is also a factor...
                </div>
                <div className='win-subtitle'>
                    <button className='btn btn-warning btn-lg' onClick={() => restartGame(false)}>Play Again</button>
                    <Link to='/profile' className='btn btn-warning btn-lg'>Go to Profile</Link>
                </div>
                </div>
                </div>
                )}
        </div>
    );
};

export default MemoryGame;