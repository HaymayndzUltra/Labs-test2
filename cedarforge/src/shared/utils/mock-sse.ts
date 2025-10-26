export function createMockSse<T>(callback: (data: T) => void, interval = 5000) {
  let active = true;
  let timer: number;

  function tick() {
    if (!active) return;
    callback({ timestamp: Date.now() } as unknown as T);
    timer = window.setTimeout(tick, interval);
  }

  timer = window.setTimeout(tick, interval);

  return () => {
    active = false;
    window.clearTimeout(timer);
  };
}
