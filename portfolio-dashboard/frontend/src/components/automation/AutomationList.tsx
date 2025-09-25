import { Workflow } from 'lucide-react';
import type { AutomationWorkflow } from '../../data/types';
import { StatusChip } from '../chips/StatusChip';

export function AutomationList({
  automations,
  onInspect,
}: {
  automations: AutomationWorkflow[];
  onInspect: (automation: AutomationWorkflow) => void;
}) {
  return (
    <section className="surface-card" style={{ display: 'grid', gap: 16 }} aria-label="Automation orchestration">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Automation orchestration</p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--neutral-500)' }}>
            Triggers, actions, and cadences that keep this module on autopilot.
          </p>
        </div>
        <Workflow size={18} />
      </header>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {automations.map((automation) => (
          <li key={automation.id}>
            <button
              type="button"
              onClick={() => onInspect(automation)}
              style={{
                width: '100%',
                textAlign: 'left',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-border)',
                background: 'var(--surface-s1)',
                padding: '16px',
                display: 'grid',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{automation.title}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                    Trigger: {automation.trigger}
                  </p>
                </div>
                <StatusChip label={automation.active ? 'Active' : 'Paused'} tone={automation.active ? 'success' : 'warning'} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--neutral-500)' }}>Action: {automation.action}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12, color: 'var(--neutral-500)' }}>
                <span className="badge">Owner: {automation.owner}</span>
                <span className="badge">Channel: {automation.channel}</span>
                <span className="badge">Cadence: {automation.cadence}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
