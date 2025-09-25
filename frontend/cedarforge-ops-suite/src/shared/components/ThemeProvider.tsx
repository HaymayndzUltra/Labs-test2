import { PropsWithChildren, useEffect } from "react";
import { useUIStore } from "@shared/state/uiStore";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (theme === "dark") {
      classList.add("theme-dark");
    } else {
      classList.remove("theme-dark");
    }
  }, [theme]);

  return children;
};
