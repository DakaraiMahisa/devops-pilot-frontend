import { AnalysisContainer } from "../features/analysis/components/AnalysisContainer";
import { useAnalysis } from "@/features/analysis/hooks/useAnalysis";
import { ResultPanel } from "../features/analysis/components/ResultPanel";

export default function NewAnalysisPage() {
  const { status, result, reset } = useAnalysis();

  const isReportMode =
    (status === "COMPLETED" || status === "IDLE") && !!result;
  const isLoading = status === "PROCESSING";

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {isReportMode ? "Analysis Report" : "New Log Analysis"}
          </h1>
          <p className="text-slate-400 text-lg">
            {isReportMode
              ? `Viewing analysis for ${result.pipelineType || "log data"}.`
              : "Paste your logs below to identify root causes and suggested fixes."}
          </p>
        </header>

        {isLoading ? (
          /* Loading State: High-tech Glass Card */
          <div className="p-24 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-indigo-400/10 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white tracking-wide uppercase">
                Engine Processing
              </p>
              <p className="text-slate-500 mt-2">
                AI is identifying root causes and generating fixes...
              </p>
            </div>
          </div>
        ) : isReportMode ? (
          /* Report Mode: The Result view */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            <ResultPanel result={result} />

            <div className="flex justify-center pt-4">
              <button
                onClick={reset}
                className="group flex items-center gap-3 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all duration-300"
              >
                <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">
                  ←
                </span>
                <span className="text-sm font-bold tracking-widest uppercase">
                  Analyze another log
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Input Mode: The Form Container */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <AnalysisContainer />
          </div>
        )}
      </div>
    </div>
  );
}
