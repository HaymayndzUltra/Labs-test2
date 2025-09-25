import StatusChip, { type StatusTone } from "./StatusChip";

interface ListCardProps {
  title: string;
  items: { title: string; meta: string; tone?: StatusTone }[];
}

export const ListCard: React.FC<ListCardProps> = ({ title, items }) => (
  <section
    style={{
      background: "var(--surface-s1)",
      borderRadius: "16px",
      border: "1px solid var(--border-color)",
      padding: "24px",
      boxShadow: "var(--shadow-elevation)",
      display: "grid",
      gap: "16px"
    }}
  >
    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{title}</h3>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
      {items.map((item) => (
        <li key={item.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{item.title}</p>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>{item.meta}</p>
          </div>
          {item.tone && <StatusChip label={item.meta} tone={item.tone} subtle />}
        </li>
      ))}
    </ul>
  </section>
);

export default ListCard;
