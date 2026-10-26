import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void; resolved: "light" | "dark" }>({ theme: "system", setTheme: () => {}, resolved: "light" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = localStorage.getItem("ravyu-theme") as Theme | null;
    if (saved) setThemeState(saved);
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const r = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
      document.documentElement.classList.toggle("dark", r === "dark");
      setResolved(r);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  const setTheme = (t: Theme) => { localStorage.setItem("ravyu-theme", t); setThemeState(t); };
  return <Ctx.Provider value={{ theme, setTheme, resolved }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
