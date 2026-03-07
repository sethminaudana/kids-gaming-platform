// frontend/src/tracking/gazeTracker.ts
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export type GazeSample = {
  ts: number;
  facePresent: boolean;
  // normalized gaze direction roughly [-1..1]
  gazeX?: number;
  gazeY?: number;
  // flattened landmarks (optional store full, but can be heavy)
  landmarks?: number[]; // [x1,y1,z1,x2,y2,z2...]
};

function flattenLandmarks(pts: Array<{ x: number; y: number; z?: number }>) {
  const out: number[] = [];
  for (const p of pts) {
    out.push(p.x, p.y, p.z ?? 0);
  }
  return out;
}

/**
 * Simple gaze approximation:
 * - Take left eye region landmarks and estimate iris center as average of a few points.
 * - Use eye corners to normalize direction.
 * This is not clinical-grade. Good for baseline research prototype.
 */
function estimateGaze(landmarks: Array<{ x: number; y: number; z?: number }>) {
  // Indices for MediaPipe FaceMesh (common)
  // left eye corners: 33 (outer), 133 (inner)
  // right eye corners: 362 (outer), 263 (inner)
  // iris points exist in refined model, but tfjs model may return them depending on config.
  // We'll use a few around eye center as fallback.

  const leftOuter = landmarks[33];
  const leftInner = landmarks[133];
  const rightOuter = landmarks[362];
  const rightInner = landmarks[263];

  const leftCenter = {
    x: (leftOuter.x + leftInner.x) / 2,
    y: (leftOuter.y + leftInner.y) / 2,
  };
  const rightCenter = {
    x: (rightOuter.x + rightInner.x) / 2,
    y: (rightOuter.y + rightInner.y) / 2,
  };

  // approximate "pupil center" as average of some eye-lid points (rough)
  const leftApproxPupil = avgPoints(landmarks, [159, 145, 153, 154]); // upper/lower eyelid region
  const rightApproxPupil = avgPoints(landmarks, [386, 374, 380, 381]);

  const gazeLeft = normDirection(leftApproxPupil, leftCenter, leftOuter, leftInner);
  const gazeRight = normDirection(rightApproxPupil, rightCenter, rightOuter, rightInner);

  // average both eyes
  return {
    gazeX: (gazeLeft.gazeX + gazeRight.gazeX) / 2,
    gazeY: (gazeLeft.gazeY + gazeRight.gazeY) / 2,
  };
}

function avgPoints(landmarks: any[], idx: number[]) {
  let x = 0, y = 0;
  for (const i of idx) { x += landmarks[i].x; y += landmarks[i].y; }
  return { x: x / idx.length, y: y / idx.length };
}

function normDirection(pupil: {x:number;y:number}, center:{x:number;y:number}, outer:any, inner:any) {
  const eyeWidth = Math.max(1e-6, Math.abs(outer.x - inner.x));
  const eyeHeight = Math.max(1e-6, eyeWidth * 0.35); // rough scale
  // pupil relative to center
  const dx = (pupil.x - center.x) / eyeWidth;   // [-~0.5..0.5]
  const dy = (pupil.y - center.y) / eyeHeight;  // [-..]
  // clamp
  return { gazeX: Math.max(-1, Math.min(1, dx * 2)), gazeY: Math.max(-1, Math.min(1, dy * 2)) };
}

export class GazeTracker {
  private model: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private video: HTMLVideoElement;
  private running = false;

  constructor(videoEl: HTMLVideoElement) {
    this.video = videoEl;
  }

  async init() {
    await tf.setBackend("webgl");
    await tf.ready();

    this.model = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "tfjs",
        refineLandmarks: true,  // better around eyes
        maxFaces: 1,
      }
    );
  }

  async start(sampleHz: number, onSample: (s: GazeSample) => void) {
    if (!this.model) throw new Error("Model not initialized");
    this.running = true;

    const intervalMs = Math.max(50, Math.floor(1000 / sampleHz)); // e.g., 10Hz => 100ms
    while (this.running) {
      const ts = Date.now();
      try {
        const faces = await this.model.estimateFaces(this.video, { flipHorizontal: true });

        if (!faces || faces.length === 0) {
          onSample({ ts, facePresent: false });
        } else {
          const keypoints = faces[0].keypoints as any[];
          const { gazeX, gazeY } = estimateGaze(keypoints);
          onSample({
            ts,
            facePresent: true,
            gazeX,
            gazeY,
            // optional: store full landmarks (heavy). You can disable later.
            landmarks: flattenLandmarks(keypoints),
          });
        }
      } catch {
        onSample({ ts, facePresent: false });
      }

      await new Promise(r => setTimeout(r, intervalMs));
    }
  }

  stop() {
    this.running = false;
  }
}
