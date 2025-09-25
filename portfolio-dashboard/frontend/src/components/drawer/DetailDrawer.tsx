import { useEffect, useRef } from 'react';
import type { AutomationWorkflow } from '../../data/types';

export function DetailDrawer({
  automation,
  onClose,
}: {
  automation?: AutomationWorkflow;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (automation && !dialog.open) {
      dialog.showModal();
    }
    if (!automation && dialog.open) {
      dialog.close();
    }
  }, [automation]);

  if (!automation) return null;

  return (
    <dialog ref={dialogRef} className="drawer" aria-labelledby="automation-detail-title" onClose={onClose}>
      <div className="drawer__panel">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <p id="automation-detail-title" style={{ margin: 0, fontSize: 'var(--font-h2-size)', fontWeight: 600 }}>
              {automation.title}
            </p>
            <p style={{ marginTop: 4, marginBottom: 0, color: 'var(--neutral-500)', fontSize: 13 }}>
              Triggered when: {automation.trigger}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            style={{ border: 'none', background: 'transparent', fontSize: 20, lineHeight: 1 }}
            aria-label="Close details"
          >
            ×
          </button>
        </header>
        <div style={{ marginTop: 16, display: 'grid', gap: 16 }}>
          <div>
            <span className="badge">Action</span>
            <p style={{ margin: '8px 0 0 0', color: 'var(--neutral-700)' }}>{automation.action}</p>
          </div>
          <div>
            <span className="badge">Owner</span>
            <p style={{ margin: '8px 0 0 0', color: 'var(--neutral-700)' }}>{automation.owner}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span className="badge">Channel: {automation.channel}</span>
            <span className="badge">Cadence: {automation.cadence}</span>
            <span className={`badge ${automation.active ? 'badge--success' : 'badge--warning'}`}>
              {automation.active ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
