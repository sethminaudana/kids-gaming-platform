# Complete Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file with your MongoDB connection string
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "PORT=4000" >> .env

# Start backend
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env file (optional)
echo "REACT_APP_API_BASE=http://localhost:4000" > .env

# Copy game files to public folder (so they can be served)
# On Windows:
xcopy /E /I "src\fish-ball-collector" "public\fish-ball-collector"
# On Linux/Mac:
cp -r src/fish-ball-collector public/

# Start frontend
npm start
```

### 3. ML Model Setup

```bash
cd ml_model
pip install -r requirements.txt

# Edit train_attention_model.py and update MONGO_URI
# Then train the model (after collecting data):
python train_attention_model.py
```

## Important Notes

### Game Files Location

The game HTML/JS files need to be accessible from the public folder. You have two options:

**Option 1: Copy to public folder (Recommended)**
- Copy `frontend/src/fish-ball-collector` to `frontend/public/fish-ball-collector`
- This allows the game to be served at `/fish-ball-collector/index.html`

**Option 2: Use React Router**
- Set up React Router to serve the game
- More complex but better integration

### MongoDB Setup

1. Create a MongoDB Atlas account (free tier available)
2. Create a new cluster
3. Get your connection string
4. Add your IP to the whitelist
5. Update `.env` file with the connection string

### Webcam Permissions

- The app requires webcam access for eye tracking
- Browser will prompt for permission
- HTTPS is required in production (localhost works for development)

### Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure PORT is not in use
- Check TypeScript compilation: `npm run build`

**Frontend errors:**
- Ensure game files are in `public/fish-ball-collector/`
- Check browser console for errors
- Verify API_BASE URL matches backend

**Eye tracking not working:**
- Check browser console for TensorFlow.js errors
- Ensure webcam permission is granted
- Try Chrome browser (best compatibility)

**Game not loading:**
- Check if `/fish-ball-collector/index.html` is accessible
- Verify all game scripts are loading
- Check browser console for JavaScript errors

## Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Play game and collect data
4. Train model: `cd ml_model && python train_attention_model.py`
5. Analyze results using `predict_attention.py`

## Data Collection

- Each game session creates a new session in MongoDB
- Gaze samples are collected at ~10Hz
- Game events are logged in real-time
- Data is sent to backend every 2 seconds

## Next Steps

1. Collect initial data (10-20 game sessions)
2. Train the ML model
3. Evaluate model performance
4. Iterate on features and model architecture
5. Deploy for research data collection

