export type LiveMetricEvent = {
  id: string;
  kpi: string;
  delta: number;
  timestamp: number;
};

type Listener = (event: LiveMetricEvent) => void;

/**
 * Lightweight SSE-style broadcaster used to simulate live KPI updates.
 */
export class LiveMetricStream {
  private listeners = new Set<Listener>();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly seed: LiveMetricEvent[]) {}

  start() {
    if (this.intervalId) return;

    let index = 0;
    this.intervalId = setInterval(() => {
      const event = this.seed[index % this.seed.length];
      const jitter = Math.random() * 1.5;
      const payload: LiveMetricEvent = {
        ...event,
        delta: Number((event.delta * jitter).toFixed(2)),
        timestamp: Date.now(),
      };
      this.emit(payload);
      index += 1;
    }, 8_000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: LiveMetricEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const liveMetricStream = new LiveMetricStream([
  { id: 'mrr', kpi: 'Monthly Recurring Revenue', delta: 1.2, timestamp: Date.now() },
  { id: 'gmv', kpi: 'Gross Merchandise Volume', delta: 0.9, timestamp: Date.now() },
  { id: 'pipeline', kpi: 'Qualified Pipeline', delta: 1.6, timestamp: Date.now() },
]);
