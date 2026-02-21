import { AnalysisContainer } from "../features/analysis/components/AnalysisContainer";
import { useAnalysis } from "@/features/analysis/hooks/useAnalysis";
import { ResultPanel } from "../features/analysis/components/ResultPanel";

export default function NewAnalysisPage() {
  const { status, result, reset } = useAnalysis();

  // This check covers both viewed reports and freshly run analysis
  const isReportMode =
    (status === "COMPLETED" || status === "IDLE") && !!result;
  const isLoading = status === "PROCESSING";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          {isReportMode ? "Analysis Report" : "New Log Analysis"}
        </h1>
        <p className="text-slate-500">
          {isReportMode
            ? `Viewing analysis for ${result.pipelineType || "log data"}.`
            : "Paste your logs below to identify root causes and suggested fixes."}
        </p>
      </header>

      {/* 1. If Loading: Show a skeleton or loading spinner 
          2. If Report Mode: Show ONLY the ResultPanel
          3. Otherwise: Show the AnalysisContainer (Input Form)
      */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium">
            AI is identifying root causes...
          </p>
        </div>
      ) : isReportMode ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultPanel result={result} />
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              Analyze another log
            </button>
          </div>
        </div>
      ) : (
        <AnalysisContainer />
      )}
    </div>
  );
}
