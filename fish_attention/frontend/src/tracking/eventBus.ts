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
  | { type: "SCORE_CHANGED"; score: number; ts: number }
  | { type: "RED_HIT"; redCount: number; ts: number }
  | { type: "REACTION"; reactionMs: number; ts: number }
  | { type: "GAME_OVER"; finalScore: number; durationMs: number; ts: number };
