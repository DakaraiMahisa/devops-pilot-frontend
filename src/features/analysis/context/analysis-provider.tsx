import type { ReactNode } from "react";
import { useAnalysis } from "../hooks/useAnalysis";
import { AnalysisContext } from "./analysis-context";

export type AnalysisContextType = ReturnType<typeof useAnalysis>;

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const analysis = useAnalysis();

  return (
    <AnalysisContext.Provider value={analysis}>
      {children}
    </AnalysisContext.Provider>
  );
}
