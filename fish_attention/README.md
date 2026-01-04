# Fish Ball Collector - Attention Study

A research project for analyzing child attention patterns through gameplay and eye-tracking data.

## Overview

This project combines:
- **Frontend**: React.js + Phaser.js game with TensorFlow.js eye tracking
- **Backend**: Node.js + Express + MongoDB for data collection
- **ML Model**: Python-based attention analysis model

## Features

- 🎮 Interactive fish ball collector game (ends when 3 red balls are eaten)
- 👁️ Real-time eye tracking using webcam (MediaPipe FaceMesh)
- 📊 Game performance tracking (score, reaction time, ball collection)
- 💾 Data storage in MongoDB Atlas
- 🤖 ML model for attention pattern analysis

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- Webcam access

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=4000
```

4. Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to localhost:4000):
```env
REACT_APP_API_BASE=http://localhost:4000
```

4. Start the frontend:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### ML Model Setup

1. Navigate to ml_model directory:
```bash
cd ml_model
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Update MongoDB connection in `train_attention_model.py`:
```python
MONGO_URI = "your_mongodb_connection_string"
```

4. Train the model (after collecting some game data):
```bash
python train_attention_model.py
```

## Usage

### Playing the Game

1. Open `http://localhost:3000` in your browser
2. Allow webcam access when prompted
3. Wait for eye tracking model to load
4. Click "Start Game" to begin
5. Use mouse or touch to move the fish
6. Collect balls (Blue=10pts, Green=20pts, Red=30pts but be careful!)
7. Game ends when 3 red balls are touched

### Data Collection

- Eye tracking data (gaze direction, facial landmarks) is captured at ~10Hz
- Game events (score changes, ball collections, reaction times) are logged
- Data is sent to backend every 2 seconds
- All data is stored in MongoDB with session IDs

### Training ML Model

After collecting game sessions:

1. Ensure you have data in MongoDB
2. Run the training script:
```bash
cd ml_model
python train_attention_model.py
```

3. The model will be saved as `attention_model.pkl`

4. Use the model for predictions:
```python
from predict_attention import predict_attention_level, analyze_session

# Predict attention from gaze samples and game events
prediction, probability = predict_attention_level(gaze_samples, game_events)

# Analyze a complete session
results = analyze_session(session_id, mongo_uri)
```

## Project Structure

```
fish_attention/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server
│   │   ├── db.ts             # MongoDB connection
│   │   ├── ws.ts             # WebSocket server
│   │   ├── models/           # MongoDB schemas
│   │   └── routes/            # API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── GamePage.tsx  # Main game page with tracking
│   │   ├── tracking/
│   │   │   ├── gazeTracker.ts # Eye tracking logic
│   │   │   └── eventBus.ts   # Event system
│   │   └── fish-ball-collector/
│   │       ├── index.html    # Game HTML
│   │       └── js/           # Game scripts
│   └── package.json
└── ml_model/
    ├── train_attention_model.py  # Model training
    ├── predict_attention.py      # Prediction utilities
    └── requirements.txt
```

## Data Models

### Session
- `participantId`: Anonymized participant ID
- `startedAt`: Session start time
- `endedAt`: Session end time
- `game`: Game name and version

### GazeSample
- `sessionId`: Reference to session
- `ts`: Timestamp
- `facePresent`: Boolean
- `gazeX`, `gazeY`: Normalized gaze direction (-1 to 1)
- `landmarks`: Facial landmark coordinates (optional)

### GameEvent
- `sessionId`: Reference to session
- `type`: Event type (GAME_START, BALL_COLLECTED, RED_HIT, GAME_OVER, etc.)
- `ts`: Timestamp
- `payload`: Event-specific data

## Research Notes

This is a university research project. Key considerations:

- **Privacy**: All participant IDs are anonymized
- **Ethics**: Webcam data (video) is never stored, only landmarks and gaze
- **Consent**: Ensure proper consent forms for child participants
- **Data**: All data should be handled according to research ethics guidelines

## Troubleshooting

### Backend import errors
- Ensure TypeScript is properly configured
- Check that all imports use correct paths
- Run `npm run build` to check for TypeScript errors

### Webcam not working
- Check browser permissions
- Ensure HTTPS in production (required for getUserMedia)
- Try different browsers (Chrome recommended)

### Eye tracking model not loading
- Check browser console for errors
- Ensure TensorFlow.js models can be downloaded
- Check network connectivity

### MongoDB connection issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database name matches

## License

This project is for research purposes only.

## Contact

For questions about this research project, please contact the research team.

