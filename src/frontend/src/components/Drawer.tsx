import { useEffect } from "react";

interface DrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ title, open, onClose, children }) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 1200
      }}
    >
      <aside
        style={{
          width: "min(480px, 100%)",
          background: "var(--surface-s1)",
          height: "100%",
          borderRadius: "24px 0 0 24px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <header style={{ padding: "24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: "22px", lineHeight: "28px" }}>{title}</h2>
          <button type="button" onClick={onClose} className="focus-ring" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            Close
          </button>
        </header>
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>{children}</div>
      </aside>
    </div>
  );
};
