import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { DonutChart } from '@shared/chart/DonutChart';
import {
  attritionCohorts,
  compBands,
  feedbackQueue,
  hiringFunnel,
  interviewLoad,
  peopleAutomations,
  peopleKpis
} from '../fixtures/data';

const compColumns: ColumnDef<(typeof compBands)[number]>[] = [
  { header: 'Band', accessorKey: 'band' },
  { header: 'Median', accessorKey: 'median', cell: (info) => `$${Number(info.getValue()).toLocaleString()}` },
  { header: 'Spread', accessorKey: 'spread' }
];

const feedbackColumns: ColumnDef<(typeof feedbackQueue)[number]>[] = [
  { header: 'Candidate', accessorKey: 'candidate' },
  { header: 'Stage', accessorKey: 'stage' },
  { header: 'Aging', accessorKey: 'age' },
  { header: 'Owner', accessorKey: 'owner' }
];

export default function PeopleDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {peopleKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-hr)" />
          </div>
        ))}
      </section>
      <div className="col-span-5">
        <ChartContainer
          title="Hiring Funnel"
          description="Applicants through hires"
          onExport={() => undefined}
          dataTable={<FunnelTable />}
        >
          <DonutChart
            data={hiringFunnel.map((stage, index) => ({
              label: stage.stage,
              value: stage.count,
              color: ['#9F6246', '#B66A2B', '#36BD83', '#4F87E7', '#E39B0F'][index % 5]
            }))}
          />
        </ChartContainer>
      </div>
      <div className="col-span-7">
        <ChartContainer
          title="Attrition Cohorts"
          description="Cohort retention lollipop"
          onExport={() => undefined}
          dataTable={<AttritionTable />}
        >
          <svg width={640} height={240} role="img" aria-label="Attrition cohorts">
            <g transform="translate(60,20)">
              {attritionCohorts.map((cohort, index) => {
                const x = index * 120;
                return (
                  <g key={cohort.cohort} transform={`translate(${x},0)`}>
                    <line x1={0} x2={0} y1={0} y2={160} stroke="var(--line-soft)" strokeWidth={1.5} />
                    <circle cx={0} cy={160 - cohort.rate * 6} r={10} fill="var(--accent-hr)" stroke="#0D0F11" strokeWidth={1.5} />
                    <text x={0} y={180} textAnchor="middle" fontSize={12} fill="var(--text-secondary)">
                      {cohort.cohort}
                    </text>
                    <text x={0} y={160 - cohort.rate * 6 - 16} textAnchor="middle" fontSize={12} fill="var(--text-primary)">
                      {cohort.rate}%
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </ChartContainer>
      </div>
      <div className="col-span-6">
        <Card title="Comp Bands" accent="var(--accent-hr)">
          <DataTable ariaLabel="Comp bands" data={compBands} columns={compColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Feedback Queue" accent="var(--accent-hr)">
          <DataTable ariaLabel="Feedback queue" data={feedbackQueue} columns={feedbackColumns} />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title="Automation Blueprints" accent="var(--accent-hr)">
          <ul className="grid grid-cols-2 gap-4">
            {peopleAutomations.map((automation) => (
              <li key={automation.name} className="rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] p-4">
                <h4 className="text-[16px] font-semibold text-[color:var(--text-primary)]">{automation.name}</h4>
                <p className="text-[12px] text-[color:var(--text-secondary)]">
                  <strong>Trigger:</strong> {automation.trigger} · <strong>Cadence:</strong> {automation.cadence}
                </p>
                <p className="text-[12px] text-[color:var(--text-secondary)]"><strong>Actions:</strong> {automation.actions.join(', ')}</p>
                <p className="text-[12px] text-[color:var(--text-secondary)]"><strong>Guardrails:</strong> {automation.guardrails.join(', ')}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function FunnelTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Stage</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {hiringFunnel.map((stage) => (
          <tr key={stage.stage}>
            <td>{stage.stage}</td>
            <td>{stage.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AttritionTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Cohort</th>
          <th>Rate %</th>
        </tr>
      </thead>
      <tbody>
        {attritionCohorts.map((cohort) => (
          <tr key={cohort.cohort}>
            <td>{cohort.cohort}</td>
            <td>{cohort.rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
