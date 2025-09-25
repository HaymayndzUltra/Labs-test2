const HEADER_TITLE = 'Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches';
const HEADER_GENERATED_AT = '09/26/2025, 4:14:00 AM';

interface MotionEntry {
  module: string;
  choreography: string;
  details: string[];
}

const MOTION_MAP: MotionEntry[] = [
  {
    module: 'Global shell',
    choreography:
      'Page enter 0–600ms → filters (0–120) → KPIs count-up (120–260) → primary charts (260–520) → secondary panels (520–600).',
    details: [
      'Micro interactions 110ms using smooth easing for hover lift (y:-2px).',
      'Reduced motion preference falls back to fade-only transitions.',
      'Focus rings animate 110ms with emphasis easing to highlight keyboard navigation.',
    ],
  },
  {
    module: 'SaaS',
    choreography: 'Cohort charts fade-slide 8px, CTA pulses .96 → 1.00 at success confirmation.',
    details: [
      'Automation builder steps staggered by 60ms (max 240ms).',
      'Toast notifications slide up + fade ~180ms, transform-only to prevent layout shift.',
      'Skeleton shimmer halts under reduced motion flag.',
    ],
  },
  {
    module: 'E-commerce',
    choreography: 'Sales trend counts up KPIs, table headers fade-in at 200ms crisp easing.',
    details: [
      'Abandoned cart ladder animates connectors sequentially with 40ms offset.',
      'Inventory warning badges pulse 200ms emphasis easing to draw attention.',
      'Baseline alignment maintained to avoid scroll jitter.',
    ],
  },
  {
    module: 'Corporate analytics',
    choreography: 'Funnel slices grow from center (200ms) while executive table crossfades.',
    details: [
      'Donut values slide in with 60ms staggering for readability.',
      'Digest summary reveals narrative copy after charts finish (320ms).',
      'Velocity alert badges use crisp easing for quick acknowledgement.',
    ],
  },
  {
    module: 'Custom web app',
    choreography: 'Kanban cards spring snap (stiffness 360 / damping 36).',
    details: [
      'Column entry delays 40ms to avoid overwhelm.',
      'Keyboard drag uses space/enter to latch; focus outline follows card via transform.',
      'Workload bars animate width only to protect performance (CLS≈0).',
    ],
  },
  {
    module: 'Content & media',
    choreography: 'Queue items cascade with 60ms offset; highlight clip generator uses narrative easing.',
    details: [
      'Status badges blend icon + text with fade/scale 110ms.',
      'Automation logs slide in from baseline to align with publishing queue.',
      'Ready/Review/Blocked states include ARIA live updates with 200ms fade.',
    ],
  },
  {
    module: 'EdTech',
    choreography: 'Heatmap squares scale from 0.92 → 1 with emphasis easing; tooltips fade on focus.',
    details: [
      'Mentor rotation timeline uses sequential fade to preserve reading order.',
      'Alerts animate background-color via opacity to keep contrast intact.',
      'Reduced motion collapses to static render without scaling.',
    ],
  },
  {
    module: 'Specialized niches',
    choreography: 'Appointment cards float in 200ms; automation tabs crossfade + slide 6px.',
    details: [
      'Healthcare reminders escalate with warning pulse (.96 → 1).',
      'Finance checklist items reveal with crisp easing to mirror approval speed.',
      'Real estate drips animate icon rotation at micro duration, transform only.',
    ],
  },
];

export default function MotionMapPage() {
  return (
    <div className="ds-app-frame">
      <header className="ds-header" aria-labelledby="motion-header">
        <div>
          <h1 id="motion-header" className="ds-header-title">
            {HEADER_TITLE}
          </h1>
          <p className="ds-header-caption">Generated at {HEADER_GENERATED_AT}</p>
        </div>
        <p className="ds-caption ds-readable-line">
          Motion tokens orchestrate transform/opacity-only animations with strict sequencing and support for reduced motion
          preferences across modules.
        </p>
      </header>

      <section className="ds-card" aria-label="Motion choreography map">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Motion choreography</h2>
            <p className="ds-card-subtitle">Durations 110/200/320ms with smooth, crisp, emphasis easings and 40–60ms staggering.</p>
          </div>
        </div>
        <div className="ds-auto-grid" role="list">
          {MOTION_MAP.map((entry) => (
            <article key={entry.module} className="ds-card dense" role="listitem">
              <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                {entry.module}
              </h3>
              <p className="ds-caption">{entry.choreography}</p>
              <ul className="ds-bullet-list">
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
