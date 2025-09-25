import React from 'react';
import type { PortfolioDashboardResponse } from '../../data/types';
import type {
  AutomationWorkflow,
  ChartPoint,
  CommerceSection,
  ContentSection,
  CorporateSection,
  CustomAppSection,
  EdTechSection,
  SaaSSection,
  SpecializedSection,
} from '../../data/types';
import { useDashboardStore } from '../../store/dashboardStore';
import { KpiBand } from '../../components/kpi/KpiBand';
import { ChartCard } from '../../components/charts/ChartCard';
import { DataTable } from '../../components/table/DataTable';
import { StatusChip } from '../../components/chips/StatusChip';
import { AutomationList } from '../../components/automation/AutomationList';
import { AutomationBuilder } from '../../components/automation/AutomationBuilder';
import { DetailDrawer } from '../../components/drawer/DetailDrawer';
import { ChurnPlaybookForm } from '../../components/forms/ChurnPlaybookForm';
import { Tooltip } from '../../components/feedback/Tooltip';

function churnSegmentsToChart(data: SaaSSection['churnSegments']): ChartPoint[] {
  return data.map((segment) => ({ label: segment.label, value: segment.value }));
}

function SaaSPanel({ data, onInspect }: { data: SaaSSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <KpiBand metrics={data.metrics} />
      <div className="grid-12">
        <div style={{ gridColumn: 'span 8' }}>
          <div className="surface-card">
            <DataTable
              id="subscription-plans"
              caption="Subscription plans"
              columns={[
                { key: 'plan', label: 'Plan' },
                { key: 'price', label: 'Price' },
                { key: 'activeUsers', label: 'Active users', numeric: true },
                { key: 'activationRate', label: 'Activation' },
                { key: 'apiAllocation', label: 'API allocation' },
                { key: 'churn', label: 'Churn' },
              ]}
              rows={data.subscriptionPlans.map((plan) => ({
                plan: `${plan.name}${plan.badge ? ` (${plan.badge})` : ''}`,
                price: plan.price,
                activeUsers: plan.activeUsers,
                activationRate: plan.activationRate,
                apiAllocation: plan.apiAllocation,
                churn: plan.churn,
              }))}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard id="churn-health" title="Churn health" type="donut" data={churnSegmentsToChart(data.churnSegments)} />
        </div>
        <div style={{ gridColumn: 'span 8' }}>
          <ChartCard id="mrr-growth" title="MRR growth" type="line" data={data.growthTrend} />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard id="api-usage" title="API usage saturation" type="area" data={data.apiUsageTrend} />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <AutomationList automations={data.automation} onInspect={onInspect} />
        </div>
        <div style={{ gridColumn: 'span 8' }}>
          <section className="surface-card" aria-label="Billing cycle orchestration" style={{ display: 'grid', gap: 12 }}>
            <header>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Billing cycle orchestration</p>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                Checklist across finance, RevOps, and engineering to ensure smooth close.
              </p>
            </header>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {data.billingCycles.map((cycle) => (
                <li key={cycle.id} className="surface-raised" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{cycle.label}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>Next run: {cycle.nextRun}</p>
                    </div>
                    <StatusChip
                      label={cycle.status === 'completed' ? 'Completed' : cycle.status === 'processing' ? 'In flight' : 'Scheduled'}
                      tone={cycle.status === 'completed' ? 'success' : cycle.status === 'processing' ? 'info' : 'warning'}
                    />
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                    Owners: {cycle.owners.join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <ChurnPlaybookForm />
        </div>
      </div>
    </div>
  );
}

function CommercePanel({ data, onInspect }: { data: CommerceSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <KpiBand metrics={data.metrics} />
      <div className="grid-12">
        <div style={{ gridColumn: 'span 6' }}>
          <div className="surface-card">
            <DataTable
              id="top-products"
              caption="Top products leaderboard"
              columns={[
                { key: 'name', label: 'Product' },
                { key: 'category', label: 'Category' },
                { key: 'revenue', label: 'Revenue', numeric: true },
                { key: 'conversionRate', label: 'Conversion' },
                { key: 'inventory', label: 'Inventory', numeric: true },
                { key: 'trend', label: 'Trend' },
              ]}
              rows={data.topProducts.map((product) => ({
                name: product.name,
                category: product.category,
                revenue: product.revenue,
                conversionRate: product.conversionRate,
                inventory: product.inventory,
                trend: product.trend,
              }))}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <ChartCard id="sales-trends" title="Sales trends" type="bar" data={data.salesTrend} />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <AutomationList automations={data.automation} onInspect={onInspect} />
        </div>
        <div style={{ gridColumn: 'span 8' }}>
          <section className="surface-card" aria-label="Operational health" style={{ display: 'grid', gap: 12 }}>
            <header>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Operational health</p>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                Monitor fulfillment, payment gateway status, and support backlog.
              </p>
            </header>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {data.operations.map((item) => (
                <li key={item.id} className="surface-raised" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.title}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>{item.description}</p>
                    </div>
                    <StatusChip
                      label={item.status === 'healthy' ? 'Healthy' : item.status === 'delayed' ? 'Delayed' : 'Attention'}
                      tone={item.status === 'healthy' ? 'success' : item.status === 'delayed' ? 'danger' : 'warning'}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function CorporatePanel({ data, onInspect }: { data: CorporateSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <KpiBand metrics={data.metrics} />
      <div className="grid-12">
        <div style={{ gridColumn: 'span 7' }}>
          <ChartCard
            id="conversion-funnel"
            title="Conversion funnel"
            type="bar"
            data={data.funnel.map((stage) => ({ label: stage.stage, value: stage.count, secondary: stage.delta }))}
            table={{
              columns: [
                { key: 'stage', label: 'Stage' },
                { key: 'count', label: 'Count', numeric: true },
                { key: 'conversion', label: 'Conversion' },
                { key: 'delta', label: 'Δ vs prior', numeric: true },
              ],
              rows: data.funnel.map((stage) => ({
                stage: stage.stage,
                count: stage.count,
                conversion: stage.conversion,
                delta: stage.delta,
              })),
            }}
          />
        </div>
        <div style={{ gridColumn: 'span 5' }}>
          <ChartCard
            id="lead-source"
            title="Lead source mix"
            type="donut"
            data={data.leadSources.map((source) => ({ label: source.label, value: source.value }))}
          />
        </div>
        <div style={{ gridColumn: 'span 5' }}>
          <section className="surface-card" style={{ display: 'grid', gap: 12 }} aria-label="Executive insights">
            <header>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Executive insights</p>
            </header>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {data.insights.map((insight) => (
                <li key={insight.id} className="surface-raised" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{insight.headline}</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>{insight.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div style={{ gridColumn: 'span 7' }}>
          <AutomationList automations={data.automation} onInspect={onInspect} />
        </div>
      </div>
    </div>
  );
}

function CustomAppPanel({ data, onInspect }: { data: CustomAppSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div className="grid-12" style={{ gap: 'var(--space-2)' }}>
      <section style={{ gridColumn: 'span 7' }} aria-label="Kanban delivery board" className="surface-card">
        <header>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Kanban delivery board</p>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
            Keyboard DnD supported: Space to lift, arrows to move, Enter to drop.
          </p>
        </header>
        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          {data.kanban.map((lane) => (
            <article key={lane.id} className="surface-raised" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{lane.title}</p>
                <span className="badge">{lane.badge}</span>
              </header>
              <ul style={{ listStyle: 'none', margin: 12, padding: 0, display: 'grid', gap: 8 }}>
                {lane.tasks.map((task) => (
                  <li key={task.id} className="surface-card" style={{ padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{task.title}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                      Owner: {task.owner} · Due {task.due} · Priority {task.priority}
                    </p>
                    {task.automation ? (
                      <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>Automation: {task.automation}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section style={{ gridColumn: 'span 5', display: 'grid', gap: 16 }} aria-label="Automation & workload">
        <ChartCard
          id="workload-distribution"
          title="Workload distribution"
          description="Assigned tasks vs capacity"
          type="bar"
          data={data.workloadDistribution}
        />
        <AutomationList automations={data.automation} onInspect={onInspect} />
        <section className="surface-card" style={{ display: 'grid', gap: 12 }} aria-label="Idea backlog">
          <header>
            <p style={{ margin: 0, fontWeight: 600 }}>Idea backlog intake</p>
          </header>
          <ul style={{ listStyle: 'disc inside', margin: 0, padding: 0, display: 'grid', gap: 4 }}>
            {data.backlogIdeas.map((idea, index) => (
              <li key={`${idea}-${index}`} style={{ fontSize: 13, color: 'var(--neutral-600)' }}>
                {idea}
              </li>
            ))}
          </ul>
        </section>
        <AutomationBuilder />
      </section>
    </div>
  );
}

function ContentPanel({ data, onInspect }: { data: ContentSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <KpiBand metrics={data.metrics} />
      <div className="grid-12">
        <div style={{ gridColumn: 'span 6' }}>
          <ChartCard id="engagement-trend" title="Engagement trend" type="line" data={data.engagementTrend} />
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <div className="surface-card">
            <DataTable
              id="top-stories"
              caption="Top performing stories"
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'format', label: 'Format' },
                { key: 'window', label: 'Window' },
                { key: 'engagement', label: 'Engagement' },
                { key: 'status', label: 'Status' },
              ]}
              rows={data.topStories.map((story) => ({
                title: story.title,
                format: story.format,
                window: story.publishedAt,
                engagement: story.engagement,
                status: story.status,
              }))}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <AutomationList automations={data.automation} onInspect={onInspect} />
        </div>
        <div style={{ gridColumn: 'span 8' }}>
          <section className="surface-card" style={{ display: 'grid', gap: 12 }} aria-label="Publishing queue">
            <header>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Publishing queue</p>
            </header>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {data.publishingQueue.map((slot) => (
                <li key={slot.id} className="surface-raised" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{slot.slot}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                    {slot.topic} · Editor {slot.editor}
                  </p>
                  <StatusChip
                    label={slot.status === 'ready' ? 'Ready' : slot.status === 'in-review' ? 'In review' : 'Blocked'}
                    tone={slot.status === 'ready' ? 'success' : slot.status === 'in-review' ? 'info' : 'danger'}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function EdtechPanel({ data, onInspect }: { data: EdTechSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <KpiBand metrics={data.metrics} />
      <div className="grid-12">
        <div style={{ gridColumn: 'span 6' }}>
          <div className="surface-card">
            <DataTable
              id="program-performance"
              caption="Program performance"
              columns={[
                { key: 'course', label: 'Course' },
                { key: 'enrollment', label: 'Enrollment', numeric: true },
                { key: 'completion', label: 'Completion' },
                { key: 'avgScore', label: 'Avg score' },
              ]}
              rows={data.courses.map((course) => ({
                course: course.title,
                enrollment: course.enrollment,
                completion: course.completion,
                avgScore: course.avgScore,
              }))}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <section className="surface-card" style={{ display: 'grid', gap: 12 }} aria-label="Student activity heatmap">
            <header>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Student activity heatmap</p>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--neutral-500)' }}>
                Arrow keys to traverse; focus reveals numeric overlay.
              </p>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.activityHeatmap.weeks.length + 1}, 1fr)`, gap: 4 }}>
              <span className="badge">Day</span>
              {data.activityHeatmap.weeks.map((week) => (
                <span key={week} className="badge">
                  {week}
                </span>
              ))}
              {data.activityHeatmap.days.map((day) => (
                <div key={day} style={{ display: 'contents' }}>
                  <span className="badge">{day}</span>
                  {data.activityHeatmap.weeks.map((week) => {
                    const value = data.activityHeatmap.values.find((entry) => entry.week === week && entry.day === day)?.score ?? 0;
                    const background = `rgba(124, 58, 237, ${Math.max(0.1, value / 100)})`;
                    return (
                      <Tooltip key={`${week}-${day}`} label={`${day} ${week}: ${value}`}> 
                        <div
                          tabIndex={0}
                          style={{
                            height: 32,
                            borderRadius: 8,
                            background,
                            display: 'grid',
                            placeItems: 'center',
                            color: value > 60 ? '#fff' : 'var(--neutral-800)',
                            fontSize: 12,
                            border: '1px solid rgba(76, 29, 149, 0.12)',
                          }}
                        >
                          {value}
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <AutomationList automations={data.automation} onInspect={onInspect} />
        </div>
        <div style={{ gridColumn: 'span 8' }}>
          <section className="surface-card" style={{ display: 'grid', gap: 12 }} aria-label="Alerts">
            <header>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--font-h3-size)' }}>Alerts & nudges</p>
            </header>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {data.alerts.map((alert) => (
                <li key={alert.id} className="surface-raised" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <StatusChip
                    label={alert.severity === 'critical' ? 'Critical' : alert.severity === 'warning' ? 'Warning' : 'Info'}
                    tone={alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}
                  />
                  <p style={{ margin: '8px 0 0 0', fontSize: 12, color: 'var(--neutral-600)' }}>{alert.message}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function SpecializedPanel({ data, onInspect }: { data: SpecializedSection; onInspect: (automation: AutomationWorkflow) => void }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <KpiBand metrics={[...data.realEstate.metrics, ...data.finance.metrics.slice(0, 2), ...data.healthcare.metrics.slice(0, 2)]} />
      <div className="grid-12">
        <div style={{ gridColumn: 'span 6' }}>
          <ChartCard id="market-momentum" title="Market momentum" type="area" data={data.realEstate.trend} />
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <ChartCard id="expense-vs-budget" title="Expense vs budget" type="line" data={data.finance.expenses} />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard
            id="roi-breakdown"
            title="ROI breakdown"
            type="donut"
            data={data.finance.roiBreakdown.map((segment) => ({ label: segment.label, value: segment.value }))}
          />
        </div>
        <div style={{ gridColumn: 'span 8' }}>
          <div className="surface-card">
            <DataTable
              id="listings-inquiries"
              caption="Listings & inquiries"
              columns={[
                { key: 'address', label: 'Listing' },
                { key: 'stage', label: 'Stage' },
                { key: 'inquiries', label: 'Inquiries', numeric: true },
                { key: 'agent', label: 'Agent' },
              ]}
              rows={data.realEstate.pipeline.map((listing) => ({
                address: listing.address,
                stage: listing.stage,
                inquiries: listing.inquiries,
                agent: listing.agent,
              }))}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <div className="surface-card">
            <DataTable
              id="healthcare-appointments"
              caption="Healthcare appointments"
              columns={[
                { key: 'patient', label: 'Patient' },
                { key: 'clinician', label: 'Clinician' },
                { key: 'start', label: 'Start time' },
                { key: 'channel', label: 'Channel' },
                { key: 'status', label: 'Status' },
              ]}
              rows={data.healthcare.appointments.map((appointment) => ({
                patient: appointment.patient,
                clinician: appointment.clinician,
                start: appointment.start,
                channel: appointment.channel,
                status: appointment.status,
              }))}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <AutomationList
            automations={[...data.realEstate.automation, ...data.finance.automation, ...data.healthcare.automation]}
            onInspect={onInspect}
          />
        </div>
      </div>
    </div>
  );
}

export function DashboardModules({ data }: { data: PortfolioDashboardResponse }) {
  const activeTab = useDashboardStore((state) => state.filters.vertical);
  const { selectedAutomation, setSelectedAutomation } = useDashboardStore((state) => ({
    selectedAutomation: state.selectedAutomation,
    setSelectedAutomation: state.setSelectedAutomation,
  }));
  let content: React.ReactNode = null;

  switch (activeTab) {
    case 'saas':
      content = <SaaSPanel data={data.saas} onInspect={setSelectedAutomation} />;
      break;
    case 'commerce':
      content = <CommercePanel data={data.commerce} onInspect={setSelectedAutomation} />;
      break;
    case 'corporate':
      content = <CorporatePanel data={data.corporate} onInspect={setSelectedAutomation} />;
      break;
    case 'customApp':
      content = <CustomAppPanel data={data.customApp} onInspect={setSelectedAutomation} />;
      break;
    case 'content':
      content = <ContentPanel data={data.content} onInspect={setSelectedAutomation} />;
      break;
    case 'edtech':
      content = <EdtechPanel data={data.edtech} onInspect={setSelectedAutomation} />;
      break;
    case 'specialized':
      content = <SpecializedPanel data={data.specialized} onInspect={setSelectedAutomation} />;
      break;
    default:
      content = null;
  }

  return (
    <>
      {content}
      <DetailDrawer automation={selectedAutomation} onClose={() => setSelectedAutomation(undefined)} />
    </>
  );
}
