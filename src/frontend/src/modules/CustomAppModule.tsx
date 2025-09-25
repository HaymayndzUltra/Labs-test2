import { useState } from "react";
import KpiBand from "../components/KpiBand";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip, { type StatusTone } from "../components/StatusChip";

const data = fixtures.customapp;

const lanes: { id: string; title: string; tone: StatusTone }[] = [
  { id: "backlog", title: "Backlog", tone: "info" },
  { id: "in-progress", title: "In progress", tone: "warning" },
  { id: "review", title: "Review", tone: "info" },
  { id: "done", title: "Done", tone: "success" }
];

export const CustomAppModule: React.FC = () => {
  const [focusedLane, setFocusedLane] = useState<string | null>(null);

  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 8", display: "grid", gap: "24px" }}>
        <div
          role="list"
          aria-label="Kanban delivery board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px"
          }}
        >
          {lanes.map((lane) => (
            <article
              key={lane.id}
              role="listitem"
              tabIndex={0}
              onFocus={() => setFocusedLane(lane.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const index = lanes.findIndex((item) => item.id === lane.id);
                  const nextIndex = event.key === "ArrowRight" ? Math.min(lanes.length - 1, index + 1) : Math.max(0, index - 1);
                  document.getElementById(lanes[nextIndex].id)?.focus();
                }
              }}
              id={lane.id}
              style={{
                background: "var(--surface-s1)",
                borderRadius: "16px",
                border: focusedLane === lane.id ? `2px solid var(--vertical-customapp)` : "1px solid var(--border-color)",
                padding: "16px",
                boxShadow: "var(--shadow-elevation)",
                outline: "none",
                display: "grid",
                gap: "12px"
              }}
            >
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{lane.title}</h3>
                <StatusChip label={`${data.charts.workload.find((item) => item.lane.toLowerCase().includes(lane.title.toLowerCase()))?.tasks ?? 0} cards`} tone={lane.tone as never} subtle />
              </header>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Space to lift, arrows to move, enter to drop.</p>
            </article>
          ))}
        </div>
        <DataTable id="idea-backlog" columns={data.tables.backlog.columns} data={data.tables.backlog.rows} />
      </section>
      <section style={{ gridColumn: "span 4", display: "grid", gap: "24px" }}>
        <ListCard title={data.lists.kanban.title} items={data.lists.kanban.items} />
        <div style={{ background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Create recurring task</h3>
          <label htmlFor="task-name" style={labelStyle}>Task name</label>
          <input id="task-name" style={inputStyle} placeholder="Sprint review" />
          <label htmlFor="task-cadence" style={labelStyle}>Cadence</label>
          <select id="task-cadence" style={inputStyle}>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>
          <label htmlFor="task-owner" style={labelStyle}>Owner</label>
          <input id="task-owner" style={inputStyle} placeholder="Team lead" />
          <button type="button" style={submitStyle}>Schedule ritual</button>
        </div>
      </section>
      <section style={{ gridColumn: "span 12", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Recurring rituals, task nudges, idea triage</p>
          </div>
          <StatusChip label="DevOps hooks" tone="info" subtle />
        </header>
        <AutomationBuilder
          triggerOptions={data.automations.triggers}
          conditionOptions={data.automations.conditions}
          actionOptions={data.automations.actions}
          cadenceOptions={data.automations.cadences}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }}
        />
      </section>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  borderRadius: "12px",
  border: "1px solid var(--border-color)",
  padding: "12px 16px",
  background: "var(--surface-s1)",
  color: "var(--text-primary)"
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--text-secondary)"
};

const submitStyle: React.CSSProperties = {
  borderRadius: "12px",
  border: "none",
  background: "var(--vertical-customapp)",
  color: "#fff",
  padding: "12px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

export default CustomAppModule;
