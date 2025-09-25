import { useEffect, useState } from 'react';
import { KPI } from '../data/fixtures';

export function useLiveKpis(initial: KPI[]) {
  const [kpis, setKpis] = useState(initial);

  useEffect(() => {
    let animationFrame: number;
    const controller = new AbortController();

    function handleTick() {
      setKpis((current) =>
        current.map((kpi) => ({
          ...kpi,
          value: Math.max(kpi.value * (1 + (Math.random() - 0.5) * 0.001), 0)
        }))
      );
      animationFrame = requestAnimationFrame(handleTick);
    }

    animationFrame = requestAnimationFrame(handleTick);

    const eventSource = new EventSource('/api/kpis', { withCredentials: false });
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as KPI[];
        setKpis(payload);
      } catch (error) {
        console.error('Failed to parse KPI payload', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      cancelAnimationFrame(animationFrame);
      controller.abort();
      eventSource.close();
    };
  }, []);

  return kpis;
}
