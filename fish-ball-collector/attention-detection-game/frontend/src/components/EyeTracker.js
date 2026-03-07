import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh, calculateGaze, calculateAttentionMetrics } from '../utils/faceUtils';
import './EyeTracker.css';

const EyeTracker = ({ onAttentionUpdate, isTracking }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [attentionMetrics, setAttentionMetrics] = useState({
    gazeStability: 0,
    blinkRate: 0,
    focusScore: 0,
    distractionCount: 0
  });
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const attentionHistory = useRef([]);
  const frameCount = useRef(0);

  // Load facemesh model
  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      const loadedModel = await facemesh.load({
        maxFaces: 1,
        refineLandmarks: true
      });
      setModel(loadedModel);
      console.log('Facemesh model loaded');
    };
    loadModel();
  }, []);

  // Request webcam permission
  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        },
        audio: false
      });
      
      if (webcamRef.current) {
        webcamRef.current.video.srcObject = stream;
        setPermissionGranted(true);
        setIsWebcamActive(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Please grant webcam permission for eye tracking');
    }
  };

  // Run detection
  useEffect(() => {
    let animationFrameId;
    
    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 &&
        model &&
        isTracking &&
        isWebcamActive
      ) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        // Set canvas dimensions
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        
        // Get face landmarks
        const predictions = await model.estimateFaces(video);
        const ctx = canvasRef.current.getContext('2d');
        
        if (predictions.length > 0) {
          // Draw facial landmarks
          drawMesh(predictions[0], ctx);
          
          // Calculate gaze and attention metrics
          const gazeData = calculateGaze(predictions[0].landmarks);
          const metrics = calculateAttentionMetrics(gazeData, predictions[0]);
          
          setAttentionMetrics(metrics);
          
          // Store in history (last 5 seconds)
          attentionHistory.current.push({
            timestamp: Date.now(),
            ...metrics,
            gazeData
          });
          
          // Keep only last 150 frames (5 seconds at 30fps)
          if (attentionHistory.current.length > 150) {
            attentionHistory.current.shift();
          }
          
          // Send updates to parent
          onAttentionUpdate({
            ...metrics,
            gazeData,
            frameNumber: frameCount.current
          });
          
          frameCount.current++;
        } else {
          // No face detected
          ctx.clearRect(0, 0, videoWidth, videoHeight);
        }
      }
      
      if (isTracking && isWebcamActive) {
        animationFrameId = requestAnimationFrame(detect);
      }
    };
    
    if (isTracking && isWebcamActive) {
      detect();
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [model, isTracking, isWebcamActive, onAttentionUpdate]);

  return (
    <div className="eye-tracker">
      <h2>Eye Tracking</h2>
      
      {!permissionGranted ? (
        <div className="permission-prompt">
          <p>Eye tracking requires webcam access</p>
          <button onClick={requestWebcamPermission} className="permission-btn">
            Enable Webcam
          </button>
        </div>
      ) : (
        <div className="tracking-container">
          <div className="video-container">
            <Webcam
              ref={webcamRef}
              className="webcam-feed"
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: 'user'
              }}
            />
            <canvas ref={canvasRef} className="landmark-canvas" />
          </div>
          
          <div className="metrics-display">
            <div className="metric-item">
              <span className="metric-label">Focus Score:</span>
              <span className="metric-value">
                {Math.round(attentionMetrics.focusScore * 100)}%
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Gaze Stability:</span>
              <span className="metric-value">
                {Math.round(attentionMetrics.gazeStability * 100)}%
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Blink Rate:</span>
              <span className="metric-value">
                {attentionMetrics.blinkRate.toFixed(1)}/min
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Distractions:</span>
              <span className="metric-value">
                {attentionMetrics.distractionCount}
              </span>
            </div>
          </div>
          
          <div className="tracking-controls">
            <button
              onClick={() => setIsWebcamActive(!isWebcamActive)}
              className={`toggle-btn ${isWebcamActive ? 'active' : 'inactive'}`}
            >
              {isWebcamActive ? 'Pause Tracking' : 'Resume Tracking'}
            </button>
            <div className="status-indicator">
              <div className={`status-dot ${isTracking ? 'tracking' : 'idle'}`}></div>
              <span>{isTracking ? 'Tracking Active' : 'Tracking Idle'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EyeTracker;