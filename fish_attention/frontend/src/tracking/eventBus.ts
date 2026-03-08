type Handler<T> = (payload: T) => void;

class EventBus {
  private handlers: Record<string, Function[]> = {};

  on<T>(event: string, handler: Handler<T>) {
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(handler);
    return () => {
      this.handlers[event] = (this.handlers[event] || []).filter(h => h !== handler);
    };
  }

  emit<T>(event: string, payload: T) {
    (this.handlers[event] || []).forEach(h => h(payload));
  }
}

export const eventBus = new EventBus();

// Event types
export type GameEventPayload =
  | { type: "GAME_START"; ts: number; sessionId: string }
  | { type: "SCORE_CHANGED"; score: number; points: number; ballColor: string; ts: number; sessionId: string }
  | { type: "BALL_COLLECTED"; ballColor: string; ballIndex: number; position: any; reactionTime: number | null; ts: number; sessionId: string }
  | { type: "REACTION"; reactionMs: number; ts: number; sessionId: string }
  | { type: "RED_HIT"; redCount: number; position: any; ts: number; sessionId: string }
  | { type: "GAME_OVER"; finalScore: number; redBallsTouched: number; ballsCollected: number; durationMs: number; averageReactionTime: number | null; ts: number; sessionId: string }
  | { type: "BALL_SPAWN"; ballColor: string; position: any; ts: number; sessionId: string }
  | { type: "GAME_PAUSED"; ts: number; sessionId: string }
  | { type: "GAME_RESUMED"; ts: number; sessionId: string };
