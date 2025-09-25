import { Fragment } from 'react';
import { ThemeToggle } from './ThemeToggle';

export type PageShellProps = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  generatedAt?: string;
  filters?: React.ReactNode;
  tabs?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageShell({ hero, generatedAt, filters, tabs, actions, children }: PageShellProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-s0)' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(18px)',
          background: 'color-mix(in srgb, var(--surface-s1) 90%, transparent)',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <div
          style={{
            marginInline: 'auto',
            maxWidth: 1280,
            padding: 'var(--space-3) clamp(16px, 4vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-caption-size)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--neutral-500)',
                  fontWeight: 600,
                }}
              >
                Portfolio-grade product operations
              </p>
              <h1
                style={{
                  fontSize: 'var(--font-h1-size)',
                  lineHeight: 'var(--font-h1-line)',
                  fontWeight: 'var(--font-h1-weight)',
                  marginBlock: 'var(--space-1)',
                  color: 'var(--neutral-900)',
                }}
              >
                {hero.title}
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--font-h2-size)', color: 'var(--neutral-600)', fontWeight: 500 }}>
                {hero.subtitle}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {actions}
              <ThemeToggle />
            </div>
          </div>
          <p style={{ margin: 0, color: 'var(--neutral-600)', maxWidth: 720 }}>{hero.description}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              style={{
                padding: '12px 20px',
                borderRadius: '999px',
                fontWeight: 600,
                background: 'var(--primary-600)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 12px 24px -18px rgba(79, 70, 229, 0.8)',
              }}
            >
              {hero.cta}
            </button>
            {generatedAt ? (
              <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Refreshed {new Date(generatedAt).toLocaleString()}</span>
            ) : null}
          </div>
        </div>
      </header>
      <main
        style={{
          marginInline: 'auto',
          maxWidth: 1280,
          paddingInline: 'clamp(16px, 4vw, 32px)',
          paddingBlock: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {filters ? <Fragment>{filters}</Fragment> : null}
        {tabs ? <Fragment>{tabs}</Fragment> : null}
        {children}
      </main>
    </div>
  );
}
