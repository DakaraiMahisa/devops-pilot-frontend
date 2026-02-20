import { AnalysisContainer } from "../features/analysis/components/AnalysisContainer";
import { useAnalysis } from "@/features/analysis/hooks/useAnalysis";
export default function NewAnalysisPage() {
  const { status, result } = useAnalysis();

  const isReportMode = status === "COMPLETED" && result;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          {isReportMode ? "Analysis Report" : "New Log Analysis"}
        </h1>
        <p className="text-slate-500">
          {isReportMode
            ? `Viewing historical analysis for ${result.pipelineType || "log data"}.`
            : "Paste your logs below to identify root causes and suggested fixes."}
        </p>
      </header>

      <AnalysisContainer />
    </div>
  );
}
