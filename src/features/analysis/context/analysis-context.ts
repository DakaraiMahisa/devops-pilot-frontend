import { createContext } from "react";
import type { AnalysisContextType } from "./analysis-provider";

export const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);
