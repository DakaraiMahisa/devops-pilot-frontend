import { createContext } from "react";

export type ModuleMode = "INTELLIGENCE" | "OPERATIONS";

export interface ThemeContextType {
  mode: ModuleMode;
  setMode: (mode: ModuleMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
