import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { eventBus, GameEventPayload } from "../tracking/eventBus";
import { GazeTracker, GazeSample } from "../tracking/gazeTracker";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export default function GamePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [status, setStatus] = useState<string>("init");
  const [webcamPermission, setWebcamPermission] = useState<boolean>(false);

  const gazeBuffer = useRef<GazeSample[]>([]);
  const gameEventBuffer = useRef<any[]>([]);

  const flushTimer = useRef<number | null>(null);
  const trackerRef = useRef<GazeTracker | null>(null);
  const gameLoadedRef = useRef<boolean>(false);

  // Create session
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/sessions`, {
          participantId: `child-${Date.now()}`, // anonymized ID
          timezone: "WITA",
          game: { name: "FishBallCollector", version: "1.0.0" },
        });
        setSessionId(res.data.sessionId);
        setStatus("session-created");
      } catch (error) {
        console.error("Failed to create session:", error);
        setStatus("error");
      }
    })();
  }, []);

  // Load game and bridge with React eventBus
  useEffect(() => {
    if (!sessionId || !gameContainerRef.current || gameLoadedRef.current) return;

    // Expose React eventBus to window for game scripts to use
    (window as any).reactEventBus = eventBus;
    
    // Create iframe to load the game (simpler and more reliable)
    const iframe = document.createElement("iframe");
    iframe.src = "/fish-ball-collector/index.html";
    iframe.style.width = "100%";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    iframe.style.background = "transparent";
    iframe.allow = "camera";
    
    iframe.onload = () => {
      gameLoadedRef.current = true;
      
      // Wait for game to initialize, then connect eventBus
      const tryConnect = () => {
        try {
          const iframeWindow = (iframe.contentWindow as any);
          if (iframeWindow && iframeWindow.gameTracker) {
            iframeWindow.gameTracker.init(eventBus, sessionId);
            // Also expose reactEventBus to iframe
            iframeWindow.reactEventBus = eventBus;
            setStatus("game-ready");
          } else {
            setTimeout(tryConnect, 500);
          }
        } catch (e) {
          // Cross-origin or not ready yet
          console.log("Waiting for game to initialize...");
          setTimeout(tryConnect, 500);
        }
      };
      
      setTimeout(tryConnect, 1000);
    };

    gameContainerRef.current.appendChild(iframe);

    return () => {
      if ((window as any).reactEventBus === eventBus) {
        delete (window as any).reactEventBus;
      }
      if (gameContainerRef.current && iframe.parentNode) {
        gameContainerRef.current.removeChild(iframe);
      }
    };
  }, [sessionId, eventBus]);

  // Hook game events from React eventBus
  useEffect(() => {
    const unsub = eventBus.on<GameEventPayload>("GAME_EVENT", (ev) => {
      gameEventBuffer.current.push({ ...ev, sessionId });
    });
    return () => unsub();
  }, [sessionId]);

  // Webcam + tracking start
  useEffect(() => {
    if (!sessionId) return;
    if (!videoRef.current) return;

    (async () => {
      try {
        setStatus("requesting-webcam");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          }, 
          audio: false 
        });
        videoRef.current!.srcObject = stream;
        await videoRef.current!.play();
        setWebcamPermission(true);

        setStatus("loading-model");
        const tracker = new GazeTracker(videoRef.current!);
        await tracker.init();
        trackerRef.current = tracker;

        setStatus("tracking");
        tracker.start(10, (sample) => {
          gazeBuffer.current.push({ ...sample, sessionId } as any);
        });

        // flush buffers every 2 seconds
        flushTimer.current = window.setInterval(async () => {
          await flushBuffers();
        }, 2000);
      } catch (error: any) {
        console.error("Webcam/tracking error:", error);
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setStatus("webcam-denied");
          alert("Webcam permission is required for eye tracking. Please allow camera access and refresh.");
        } else {
          setStatus("tracking-error");
        }
      }
    })();

    return () => {
      trackerRef.current?.stop();
      if (flushTimer.current) window.clearInterval(flushTimer.current);
      const v = videoRef.current;
      const s = v?.srcObject as MediaStream | null;
      s?.getTracks()?.forEach(t => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function flushBuffers() {
    if (!sessionId) return;
    const gaze = gazeBuffer.current.splice(0, gazeBuffer.current.length);
    const events = gameEventBuffer.current.splice(0, gameEventBuffer.current.length);
    if (gaze.length === 0 && events.length === 0) return;

    try {
      await axios.post(`${API_BASE}/api/sessions/${sessionId}/ingest`, {
        gazeSamples: gaze,
        gameEvents: events,
      });
    } catch (error) {
      console.error("Failed to flush buffers:", error);
      // Re-add to buffer on error (simple retry)
      gazeBuffer.current.unshift(...gaze);
      gameEventBuffer.current.unshift(...events);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Fish Ball Collector - Attention Study</h1>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Session ID:</strong> {sessionId || "Creating..."}</p>
        {!webcamPermission && (
          <div style={{ padding: "10px", background: "#fff3cd", borderRadius: "4px", marginTop: "10px" }}>
            ⚠️ Please allow webcam access when prompted to enable eye tracking.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "800px" }}>
          <h3>Game</h3>
          <div ref={gameContainerRef} style={{ background: "#f0f0f0", borderRadius: "8px", overflow: "hidden" }}>
            {/* Game will be loaded here via iframe */}
            {!gameLoadedRef.current && (
              <div style={{ padding: "40px", textAlign: "center" }}>
                Loading game...
              </div>
            )}
          </div>
        </div>

        <div style={{ width: "320px" }}>
          <h3>Eye Tracking</h3>
          <video 
            ref={videoRef} 
            width={320} 
            height={240} 
            playsInline 
            muted 
            autoPlay
            style={{ 
              borderRadius: "8px", 
              background: "#000",
              transform: "scaleX(-1)" // mirror for user
            }} 
          />
          <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
            ⚠️ Only facial landmarks and gaze direction are stored (no video saved).
            <br />
            <strong>Privacy:</strong> All data is anonymized and used only for research purposes.
          </p>
          
          {status === "tracking" && (
            <div style={{ marginTop: "10px", padding: "10px", background: "#d4edda", borderRadius: "4px" }}>
              ✅ Eye tracking active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
