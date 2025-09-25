import { cloneElement, useId, useState } from 'react';

export function Tooltip({ label, children }: { label: string; children: React.ReactElement }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <span
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {cloneElement(children as React.ReactElement<any>, { 'aria-describedby': id })}
      <span
        role="tooltip"
        id={id}
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--neutral-900)',
          color: '#fff',
          padding: '6px 8px',
          borderRadius: 8,
          fontSize: 12,
          opacity: visible ? 1 : 0,
          pointerEvents: 'none',
          transition: 'var(--transition-medium)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </span>
  );
}
