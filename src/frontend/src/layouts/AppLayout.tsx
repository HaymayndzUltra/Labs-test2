import { NavLink } from "react-router-dom";
import { modules } from "../data/modules";
import ThemeSwitcher from "../components/ThemeSwitcher";
import GlobalFilterBar from "../components/GlobalFilterBar";
import { ToastProvider } from "../components/toast/ToastContext";
import { ToastViewport } from "../components/toast/ToastViewport";

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap"
};

const linkStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
  border: "1px solid transparent"
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", background: "var(--surface-s0)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
        <header
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--surface-s1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 600 }}>Portfolio-grade Product Operations</h1>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
                Unified governance across SaaS, Commerce, Analytics, Media, EdTech & specialized verticals.
              </p>
            </div>
            <ThemeSwitcher />
          </div>
          <nav aria-label="Primary navigation" style={navStyle}>
            {modules.map((module) => (
              <NavLink
                key={module.id}
                to={module.path}
                style={({ isActive }) => ({
                  ...linkStyle,
                  background: isActive ? `var(--vertical-${module.id})` : "transparent",
                  color: isActive ? "#fff" : "var(--text-primary)",
                  borderColor: isActive ? `var(--vertical-${module.id})` : "var(--border-color)"
                })}
              >
                {module.name}
              </NavLink>
            ))}
          </nav>
          <GlobalFilterBar />
        </header>
        <main style={{ flex: 1, padding: "32px", display: "grid", gap: "32px" }}>{children}</main>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default AppLayout;
