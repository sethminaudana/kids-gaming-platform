// backend/src/ws.ts
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

type ClientMeta = {
  sessionId?: string;
};

type WsClient = WebSocket & { meta?: ClientMeta };

let wss: WebSocketServer | null = null;

export function initWebSocket(server: http.Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WsClient) => {
    ws.meta = {};

    ws.send(
      JSON.stringify({
        type: "CONNECTED",
        message: "WebSocket connected. Send {type:'SUBSCRIBE', sessionId:'...'}",
      })
    );

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === "SUBSCRIBE" && typeof msg.sessionId === "string") {
          ws.meta!.sessionId = msg.sessionId;
          ws.send(
            JSON.stringify({
              type: "SUBSCRIBED",
              sessionId: msg.sessionId,
            })
          );
        }
      } catch (e) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "Invalid JSON message",
          })
        );
      }
    });

    ws.on("close", () => {
      // nothing to cleanup beyond socket close
    });
  });

  console.log("✅ WebSocket server initialized");
}

export function broadcastToSession(sessionId: string, payload: any) {
  if (!wss) return;

  const msg = JSON.stringify({
    type: "SESSION_EVENT",
    sessionId,
    payload,
    ts: Date.now(),
  });

  for (const client of wss.clients) {
    const c = client as WsClient;
    if (c.readyState === WebSocket.OPEN && c.meta?.sessionId === sessionId) {
      c.send(msg);
    }
  }
}

export function broadcastAll(payload: any) {
  if (!wss) return;

  const msg = JSON.stringify({
    type: "BROADCAST",
    payload,
    ts: Date.now(),
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}
