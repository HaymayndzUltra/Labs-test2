import Link from 'next/link';
import { designTokens } from '@/lib/designTokens';

const HEADER_TITLE = 'Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches';
const HEADER_GENERATED_AT = '09/26/2025, 4:14:00 AM';

export default function HomePage() {
  return (
    <div className="ds-app-frame" role="presentation">
      <header className="ds-header" aria-labelledby="home-header">
        <div>
          <h1 id="home-header" className="ds-header-title">
            {HEADER_TITLE}
          </h1>
          <p className="ds-header-caption">Generated at {HEADER_GENERATED_AT}</p>
        </div>
        <p className="ds-caption ds-readable-line">
          This interface orchestrates a production-grade dashboard spanning seven business modules with a unified design
          system, world-class motion, WCAG AA accessibility, and automation-ready information architecture.
        </p>
      </header>

      <section className="ds-card">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Start exploring</h2>
            <p className="ds-card-subtitle">
              Switch into the multi-module experience, inspect design tokens, or review the motion choreography map.
            </p>
          </div>
        </div>
        <div className="ds-inline-controls">
          <Link href="/dashboard" className="ds-button" aria-label="Open premium dashboard">
            Enter dashboard
          </Link>
          <Link href="/docs/design-tokens" className="ds-button secondary" aria-label="View design tokens sheet">
            Design tokens
          </Link>
          <Link href="/docs/motion-map" className="ds-button secondary" aria-label="View motion choreography map">
            Motion map
          </Link>
        </div>
      </section>

      <section className="ds-card" aria-label="Token overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">System palette preview</h2>
            <p className="ds-card-subtitle">Light and dark parity with semantic ramps for primary, success, warning, error, and info.</p>
          </div>
        </div>
        <div className="ds-auto-grid" role="list">
          {designTokens.colors.map((token) => (
            <div key={token.name} className="ds-card dense ds-gradient-border" role="listitem">
              <div
                className="ds-chart-placeholder"
                aria-hidden="true"
                style={{
                  background: `linear-gradient(135deg, ${token.light}33, ${token.dark}22), var(--ds-color-bg-subtle)`,
                }}
              />
              <div className="ds-label-stack">
                <strong>{token.name}</strong>
                <span className="ds-caption">Light: {token.light}</span>
                <span className="ds-caption">Dark: {token.dark}</span>
                <p className="ds-caption">{token.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
