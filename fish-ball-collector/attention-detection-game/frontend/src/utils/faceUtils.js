// Utility functions for face detection and gaze tracking

export const drawMesh = (prediction, ctx) => {
  if (!prediction || !prediction.scaledMesh) return;
  
  const keypoints = prediction.scaledMesh;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw facial landmarks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  keypoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 1, 0, 3 * Math.PI);
    ctx.fill();
  });

  // Draw eye regions
  const leftEyePoints = keypoints.slice(33, 46);
  const rightEyePoints = keypoints.slice(46, 59);
  
  drawEyeRegion(leftEyePoints, ctx, 'rgba(0, 255, 0, 0.3)');
  drawEyeRegion(rightEyePoints, ctx, 'rgba(0, 255, 0, 0.3)');

  // Draw gaze direction
  const gaze = calculateGaze(keypoints);
  drawGazeDirection(gaze, ctx, keypoints);
};

const drawEyeRegion = (eyePoints, ctx, color) => {
  if (eyePoints.length < 10) return;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(eyePoints[0][0], eyePoints[0][1]);
  
  for (let i = 1; i < eyePoints.length; i++) {
    ctx.lineTo(eyePoints[i][0], eyePoints[i][1]);
  }
  
  ctx.closePath();
  ctx.fill();
};

export const calculateGaze = (keypoints) => {
  if (!keypoints || keypoints.length < 10) return null;
  
  // Get eye points (simplified)
  const leftEye = keypoints[33];
  const rightEye = keypoints[263];
  const nose = keypoints[1];
  
  // Calculate eye centers
  const leftEyeCenter = keypoints.slice(33, 46).reduce((acc, point) => {
    return [acc[0] + point[0], acc[1] + point[1]];
  }, [0, 0]).map(val => val / 13);
  
  const rightEyeCenter = keypoints.slice(46, 59).reduce((acc, point) => {
    return [acc[0] + point[0], acc[1] + point[1]];
  }, [0, 0]).map(val => val / 13);
  
  // Calculate gaze direction (simplified)
  const eyeCenter = [
    (leftEyeCenter[0] + rightEyeCenter[0]) / 2,
    (leftEyeCenter[1] + rightEyeCenter[1]) / 2
  ];
  
  // Normalize gaze direction relative to head position
  const gazeDirection = [
    (eyeCenter[0] - nose[0]) / 100,
    (eyeCenter[1] - nose[1]) / 100
  ];
  
  return {
    leftEyeCenter,
    rightEyeCenter,
    eyeCenter,
    gazeDirection,
    normalized: {
      x: Math.max(-1, Math.min(1, gazeDirection[0])),
      y: Math.max(-1, Math.min(1, gazeDirection[1]))
    }
  };
};

const drawGazeDirection = (gaze, ctx, keypoints) => {
  if (!gaze) return;
  
  const { eyeCenter, normalized } = gaze;
  const length = 50;
  
  ctx.beginPath();
  ctx.moveTo(eyeCenter[0], eyeCenter[1]);
  ctx.lineTo(
    eyeCenter[0] + normalized.x * length,
    eyeCenter[1] + normalized.y * length
  );
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Draw gaze point
  ctx.beginPath();
  ctx.arc(
    eyeCenter[0] + normalized.x * length,
    eyeCenter[1] + normalized.y * length,
    5, 0, Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.fill();
};

export const calculateAttentionMetrics = (gazeData, prediction) => {
  if (!gazeData || !prediction) {
    return {
      gazeStability: 0,
      blinkRate: 0,
      focusScore: 0,
      distractionCount: 0,
      eyeAspectRatio: 0,
      headPose: { x: 0, y: 0, z: 0 }
    };
  }
  
  // Calculate Eye Aspect Ratio (EAR) for blink detection
  const leftEyeEAR = calculateEAR(prediction.landmarks.slice(33, 46));
  const rightEyeEAR = calculateEAR(prediction.landmarks.slice(46, 59));
  const avgEAR = (leftEyeEAR + rightEyeEAR) / 2;
  
  // Calculate head pose (simplified)
  const headPose = calculateHeadPose(prediction.landmarks);
  
  // Gaze stability (variance of gaze direction)
  const gazeStability = 1 - Math.sqrt(
    Math.pow(gazeData.normalized.x, 2) + Math.pow(gazeData.normalized.y, 2)
  ) / Math.sqrt(2);
  
  // Focus score (combines gaze stability and head pose)
  const focusScore = (
    gazeStability * 0.6 + 
    (1 - Math.abs(headPose.x)) * 0.2 + 
    (1 - Math.abs(headPose.y)) * 0.2
  );
  
  // Blink detection (simplified)
  const isBlinking = avgEAR < 0.2;
  
  return {
    gazeStability: Math.max(0, Math.min(1, gazeStability)),
    blinkRate: isBlinking ? 1 : 0,
    focusScore: Math.max(0, Math.min(1, focusScore)),
    distractionCount: focusScore < 0.5 ? 1 : 0,
    eyeAspectRatio: avgEAR,
    headPose,
    timestamp: Date.now()
  };
};

const calculateEAR = (eyePoints) => {
  if (!eyePoints || eyePoints.length < 6) return 1;
  
  // Calculate vertical distances
  const vertical1 = distance(eyePoints[1], eyePoints[5]);
  const vertical2 = distance(eyePoints[2], eyePoints[4]);
  
  // Calculate horizontal distance
  const horizontal = distance(eyePoints[0], eyePoints[3]);
  
  // Eye Aspect Ratio
  return (vertical1 + vertical2) / (2 * horizontal);
};

const distance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2[0] - point1[0], 2) + 
    Math.pow(point2[1] - point1[1], 2)
  );
};

const calculateHeadPose = (keypoints) => {
  if (!keypoints || keypoints.length < 10) return { x: 0, y: 0, z: 0 };
  
  // Simplified head pose calculation
  const nose = keypoints[1];
  const forehead = keypoints[10];
  const leftEar = keypoints[234];
  const rightEar = keypoints[454];
  
  // Calculate roll (head tilt)
  const roll = Math.atan2(
    rightEar[1] - leftEar[1],
    rightEar[0] - leftEar[0]
  );
  
  // Calculate pitch (head nod)
  const pitch = Math.atan2(
    forehead[1] - nose[1],
    Math.abs(forehead[0] - nose[0])
  );
  
  return {
    x: Math.sin(roll), // Head tilt
    y: Math.sin(pitch), // Head nod
    z: 0 // Not calculated in this simplified version
  };
};