export function StatusChip({ label, tone }: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' }) {
  const toneMap: Record<typeof tone, { bg: string; color: string }> = {
    success: { bg: 'var(--success-100)', color: 'var(--success-700)' },
    warning: { bg: 'var(--warning-100)', color: 'var(--warning-700)' },
    danger: { bg: 'var(--danger-100)', color: 'var(--danger-700)' },
    info: { bg: 'var(--info-100)', color: 'var(--info-700)' },
  } as const;
  const palette = toneMap[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 999,
        background: palette.bg,
        color: palette.color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}
