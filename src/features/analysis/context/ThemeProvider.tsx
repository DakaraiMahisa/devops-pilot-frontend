import { useState, type ReactNode } from "react";
import { ThemeContext, type ModuleMode } from "./ThemeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ModuleMode>("INTELLIGENCE");

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <div
        className={mode === "INTELLIGENCE" ? "theme-indigo" : "theme-emerald"}
      >
        <div className="transition-colors duration-700 ease-in-out min-h-screen">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
