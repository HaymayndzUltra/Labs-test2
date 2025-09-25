import { specializedKpis } from '../data/fixtures';
import { KpiCard } from '../components/primitives/KpiCard';
import { DonutChart } from '../components/charts/DonutChart';
import { AreaChart } from '../components/charts/AreaChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';

const listings = [
  ['Marina tower penthouse', 'Active', '6 offers'],
  ['SoHo loft', 'In negotiation', '3 offers'],
  ['Austin tech campus', 'New', '2 tours'],
  ['Mountain lodge', 'Under contract', '1 offer']
];

const appointments = [
  ['Cardiology', '32', 'HIPAA compliant', '2 reschedules'],
  ['Oncology', '26', 'HIPAA compliant', '0 reschedules'],
  ['Pediatrics', '44', 'HIPAA compliant', '5 reschedules']
];

const expenseVsBudget = [
  { label: 'Q1', value: 92 },
  { label: 'Q2', value: 96 },
  { label: 'Q3', value: 101 },
  { label: 'Q4', value: 88 }
];

const roiBreakdown = [
  { label: 'Acquisition', value: 42 },
  { label: 'Retention', value: 28 },
  { label: 'Expansion', value: 22 },
  { label: 'Other', value: 8 }
];

export function SpecializedNichesModule() {
  return (
    <div className="dashboard-grid" data-accent="specialized">
      <section className="kpi-band" aria-label="Specialized KPIs">
        {Object.entries(specializedKpis).map(([vertical, kpis]) => (
          <div key={vertical} className="card">
            <h3 className="card__title">{titleCase(vertical)}</h3>
            <div className="card-list">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.label} kpi={kpi} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <AreaChart
        title="Market momentum"
        description="Listings volume vs inquiries trend."
        series={expenseVsBudget.map((item, index) => ({ label: item.label, value: item.value * (index + 1) * 10 }))}
        gradientId="market-momentum"
        verticalAccent="var(--vertical-specialized)"
      />

      <DonutChart
        title="ROI breakdown"
        description="Contribution by initiative with AA contrast palette."
        series={roiBreakdown}
        palette={["#4C86B7", "#34D399", "#F59E0B", "#EF4444"]}
      />

      <div className="card col-6" role="region" aria-labelledby="listings">
        <div className="card__header">
          <h2 id="listings" className="card__title">
            Listings & inquiries
          </h2>
        </div>
        <DataTable columns={['Listing', 'Status', 'Activity']} rows={listings} />
      </div>

      <div className="card col-6" role="region" aria-labelledby="appointments">
        <div className="card__header">
          <h2 id="appointments" className="card__title">
            Healthcare appointments
          </h2>
        </div>
        <DataTable columns={['Department', 'Appointments', 'Compliance', 'Reschedules']} rows={appointments} />
      </div>

      <div className="card col-6">
        <AutomationBuilder
          name="specialized-real-estate"
          defaults={{
            trigger: 'New listing hits high-momentum micro-market',
            conditions: 'Check agent availability; enforce compliance disclosures.',
            actions: 'Notify agent → Launch listing nurture drip → Monitor responses',
            cadence: 'Every hour with immediate kickoff on upload.'
          }}
        />
      </div>

      <div className="card col-6">
        <AutomationBuilder
          name="specialized-healthcare"
          defaults={{
            trigger: 'Patient misses appointment or reschedules twice',
            conditions: 'Respect HIPAA preferences; mask PHI in logs.',
            actions: 'Send SMS reminder via Twilio → Offer smart reschedule → Log to audit trail',
            cadence: 'Check daily at 6am local facility time.'
          }}
        />
      </div>
    </div>
  );
}

function titleCase(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}
