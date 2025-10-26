import { useEffect, useRef } from 'react';

export function AccessibilityAnnouncer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new MutationObserver(() => {
      node.textContent = node.textContent;
    });
    observer.observe(node, { childList: true });

    return () => observer.disconnect();
  }, []);

  return <div aria-live="polite" aria-atomic="true" className="sr-only" ref={ref} />;
}
