import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { BarChart, DonutChart } from "@shared/chart/ChartPrimitives";
import { DataTable } from "@shared/components/DataTable";
import { ModuleViewProps } from "../../moduleRegistry";
import { funnel, compBands, attritionCohorts, interviewLoad, feedbackQueue } from "../fixtures";
import { useSseMock } from "@shared/hooks/useSseMock";
import { formatPercent } from "@shared/utils/format";

const PeopleDashboard = ({ onToast }: ModuleViewProps) => {
  const headcount = useSseMock(1248);
  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard title="Headcount" value={headcount} delta={0.03} timeframe="Global" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="Offers out" value={48} delta={0.12} timeframe="This month" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="Time-to-fill" value={37} delta={-0.08} timeframe="Days" format="number" positiveIsGood={false} />
        </div>
        <div className="col-span-3">
          <KPICard title="Attrition %" value={11.2} delta={0.01} timeframe="Rolling" format="percent" positiveIsGood={false} />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-7">
          <Card title="Funnel" subtitle="Applicants → Offer → Hire" padding="lg">
            <BarChart
              title="Hiring funnel"
              data={funnel.map((stage) => ({ label: stage.stage, value: stage.count }))}
              xAccessor={(item) => item.label}
              yAccessor={(item) => item.value}
            />
          </Card>
        </div>
        <div className="col-span-5 space-y-6">
          <Card title="Comp bands" subtitle="In-range %" padding="lg">
            <DonutChart
              title="Comp range"
              data={compBands.map((band) => ({ label: band.band, value: band.range[1] - band.range[0] }))}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
            />
          </Card>
          <Card title="Interview load" subtitle="This week" padding="lg">
            <DataTable
              caption="Interview load"
              exportFilename="interview-load"
              columns={[
                { id: "interviewer", header: "Interviewer", accessor: (row) => row.interviewer },
                { id: "interviews", header: "Interviews", accessor: (row) => row.interviews, numeric: true },
              ]}
              data={interviewLoad}
            />
          </Card>
        </div>
      </section>

      <Card title="Attrition cohorts" subtitle="Rolling 12m" padding="lg">
        <DataTable
          caption="Attrition cohorts"
          exportFilename="attrition-cohorts"
          columns={[
            { id: "cohort", header: "Cohort", accessor: (row) => row.cohort },
            { id: "attrition", header: "Attrition", accessor: (row) => formatPercent(row.attrition), numeric: true },
          ]}
          data={attritionCohorts}
        />
      </Card>

      <Card title="Feedback queue" subtitle="Needs attention" padding="lg">
        <ul className="space-y-3 text-sm text-text-secondary">
          {feedbackQueue.map((item) => (
            <li key={item.candidate} className="rounded-lg border border-line-soft bg-background-card px-3 py-2">
              <p className="text-sm font-semibold text-text-primary">{item.candidate}</p>
              <p className="text-xs text-text-muted">{item.stage} · aging {item.aging}</p>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
          onClick={() =>
            onToast({
              id: `people-${Date.now()}`,
              title: "Feedback nudges queued",
              description: "Interviewers will receive Slack reminders.",
              tone: "info",
            })
          }
        >
          Notify interviewers
        </button>
      </Card>
    </div>
  );
};

export default PeopleDashboard;
