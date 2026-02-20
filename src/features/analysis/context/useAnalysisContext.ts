import { useContext } from "react";
import { AnalysisContext } from "./analysis-context";

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysisContext must be used within AnalysisProvider");
  }
  return context;
}
