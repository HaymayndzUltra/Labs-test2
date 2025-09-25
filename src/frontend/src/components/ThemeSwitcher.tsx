import { availableThemes, useTheme } from "../theme/ThemeProvider";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setThemeId } = useTheme();
  return (
    <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
      <label htmlFor="theme-select" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
        Theme
      </label>
      <select
        id="theme-select"
        value={theme.id}
        onChange={(event) => setThemeId(event.target.value as never)}
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          padding: "8px 12px",
          background: "var(--surface-s1)",
          color: "var(--text-primary)"
        }}
      >
        {availableThemes.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;
