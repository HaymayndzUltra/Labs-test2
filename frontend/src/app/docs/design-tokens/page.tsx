import { designTokens } from '@/lib/designTokens';

const HEADER_TITLE = 'Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches';
const HEADER_GENERATED_AT = '09/26/2025, 4:14:00 AM';

export default function DesignTokensPage() {
  return (
    <div className="ds-app-frame">
      <header className="ds-header" aria-labelledby="tokens-header">
        <div>
          <h1 id="tokens-header" className="ds-header-title">
            {HEADER_TITLE}
          </h1>
          <p className="ds-header-caption">Generated at {HEADER_GENERATED_AT}</p>
        </div>
        <p className="ds-caption ds-readable-line">
          Tokenized color, typography, spacing, elevation, and motion primitives ensure consistent hierarchy, contrast, and
          motion choreography across light, dark, and RTL experiences.
        </p>
      </header>
      <section className="ds-card" aria-label="Color tokens">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Color tokens</h2>
            <p className="ds-card-subtitle">Neutral canvas, purple primary, semantic ramps for success, warning, error, info.</p>
          </div>
        </div>
        <div className="ds-auto-grid" role="list">
          {designTokens.colors.map((token) => (
            <div key={token.name} className="ds-card dense ds-gradient-border" role="listitem">
              <strong>{token.name}</strong>
              <span className="ds-caption">Light: {token.light}</span>
              <span className="ds-caption">Dark: {token.dark}</span>
              <p className="ds-caption">{token.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-card" aria-label="Typography scale">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Typography</h2>
            <p className="ds-card-subtitle">Scale 32/24/18/14 with weights 600/500/400. KPIs use tabular lining figures.</p>
          </div>
        </div>
        <table className="ds-table" aria-label="Typography tokens">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Size (px)</th>
              <th scope="col">Line height (px)</th>
              <th scope="col">Weight</th>
              <th scope="col">Usage</th>
            </tr>
          </thead>
          <tbody>
            {designTokens.typography.map((token) => (
              <tr key={token.name}>
                <td>{token.name}</td>
                <td>{token.size}</td>
                <td>{token.lineHeight}</td>
                <td>{token.weight}</td>
                <td>{token.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="ds-card" aria-label="Spacing, elevation, motion">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Spacing, elevation, motion</h2>
            <p className="ds-card-subtitle">Strict 8pt rhythm, raised surfaces, and luxury motion easings.</p>
          </div>
        </div>
        <div className="ds-auto-grid">
          <div className="ds-card dense" aria-label="Spacing tokens">
            <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
              Spacing
            </h3>
            <ul className="ds-bullet-list">
              {designTokens.spacing.map((token) => (
                <li key={token.name}>
                  <strong>{token.name}</strong> — {token.value}px ({token.usage})
                </li>
              ))}
            </ul>
          </div>
          <div className="ds-card dense" aria-label="Elevation tokens">
            <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
              Elevation
            </h3>
            <ul className="ds-bullet-list">
              {designTokens.elevation.map((token) => (
                <li key={token.name}>
                  <strong>{token.name}</strong> — {token.value} ({token.usage})
                </li>
              ))}
            </ul>
          </div>
          <div className="ds-card dense" aria-label="Motion tokens">
            <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
              Motion
            </h3>
            <ul className="ds-bullet-list">
              {designTokens.motion.map((token) => (
                <li key={token.name}>
                  <strong>{token.name}</strong> — {token.duration}ms / {token.easing} ({token.usage})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
