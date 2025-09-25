import { useEffect, useState } from "react";

export interface LiveMetric {
  id: string;
  label: string;
  value: number;
  updatedAt: string;
}

export const useLiveMetrics = (endpoint: string) => {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);

  useEffect(() => {
    let events: EventSource | null = null;
    let reconnectTimer: number | undefined;

    const connect = () => {
      events?.close();
      events = new EventSource(endpoint);

      events.onmessage = (event) => {
        const data = JSON.parse(event.data) as LiveMetric[];
        setMetrics(data);
      };

      events.onerror = () => {
        events?.close();
        reconnectTimer = window.setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      events?.close();
    };
  }, [endpoint]);

  return metrics;
};

export const mockLiveMetricsStream = (callback: (metrics: LiveMetric[]) => void) => {
  const metrics: LiveMetric[] = [
    { id: "mrr", label: "MRR", value: 420000, updatedAt: new Date().toISOString() },
    { id: "usage", label: "API Usage", value: 78, updatedAt: new Date().toISOString() }
  ];
  let step = 0;
  const interval = window.setInterval(() => {
    step += 1;
    const updated = metrics.map((metric, index) => ({
      ...metric,
      value: metric.value + Math.sin(step + index) * 10,
      updatedAt: new Date().toISOString()
    }));
    callback(updated);
  }, 4000);
  return () => window.clearInterval(interval);
};
