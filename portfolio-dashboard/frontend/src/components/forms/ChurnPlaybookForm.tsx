import { useState } from 'react';
import { Tooltip } from '../feedback/Tooltip';
import { useToast } from '../toast/ToastProvider';

const templates = [
  { id: 'renewal-save', label: 'Renewal save sequence' },
  { id: 'seat-rescue', label: 'Seat utilization rescue' },
  { id: 'payment-recovery', label: 'Payment recovery orchestration' },
];

export function ChurnPlaybookForm() {
  const { pushToast } = useToast();
  const [template, setTemplate] = useState(templates[0].id);
  const [owner, setOwner] = useState('csm@portfolio.co');
  const [threshold, setThreshold] = useState(20);
  const [message, setMessage] = useState('We noticed usage is dipping. Let’s recalibrate your workspace.');

  return (
    <form
      className="surface-card"
      style={{ display: 'grid', gap: 16 }}
      aria-label="Churn recovery playbook"
      onSubmit={(event) => {
        event.preventDefault();
        pushToast({ title: 'Playbook saved', description: `${templates.find((t) => t.id === template)?.label}`, level: 'success' });
      }}
    >
      <header>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Churn recovery playbook</p>
        <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
          Configure fallback owner, triggers, and preview the outbound messaging.
        </p>
      </header>
      <label style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>Template</span>
        <select
          value={template}
          onChange={(event) => setTemplate(event.target.value)}
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
        >
          {templates.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>Fallback owner</span>
        <input
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
          required
        />
      </label>
      <label style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>Trigger threshold (%)</span>
        <Tooltip label="Percentage drop in API or seat usage before escalation">
          <input
            type="number"
            min={5}
            max={80}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--surface-border)',
              background: 'var(--surface-s1)',
            }}
            required
          />
        </Tooltip>
      </label>
      <label style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>Message preview</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
        />
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            borderRadius: '999px',
            background: 'var(--primary-600)',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
          }}
        >
          Save playbook
        </button>
        <button
          type="button"
          onClick={() => pushToast({ title: 'Preview sent', description: 'Delivered to fallback owner inbox', level: 'info' })}
          style={{
            padding: '12px 20px',
            borderRadius: '999px',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
            fontWeight: 600,
          }}
        >
          Send preview
        </button>
      </div>
    </form>
  );
}
