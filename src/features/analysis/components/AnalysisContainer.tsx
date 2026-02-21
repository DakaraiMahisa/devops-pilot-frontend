import { useAnalysis } from "../hooks/useAnalysis";
import { StatusIndicator } from "./StatusIndicator";
import { ResultPanel } from "./ResultPanel";
import { ErrorBanner } from "./ErrorBanner";
import AnalysisForm from "./AnalysisForm";
import { Button } from "@mui/material";
export function AnalysisContainer() {
  const { status, result, error, startAnalysis, cancel, retry, reset } =
    useAnalysis();

  // If we have a result and we aren't currently re-processing,
  // we are in "Report Mode"
  const isReportMode = status === "COMPLETED" && result;

  return (
    <div className="space-y-6">
      {/* 1. Form - Only show if we aren't viewing a finished report */}
      {!isReportMode && (
        <AnalysisForm
          onSubmit={startAnalysis}
          disabled={status === "PROCESSING"}
        />
      )}

      {/* 2. Progress Feedback - Hide this entirely when COMPLETED and result is shown */}
      {!isReportMode && status !== "IDLE" && (
        <div className="flex flex-col items-center gap-4">
          <StatusIndicator status={status} />

          {status === "PROCESSING" && (
            <button
              onClick={cancel}
              className="text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              Cancel Analysis
            </button>
          )}

          {status === "FAILED" && (
            <Button
              variant="contained"
              onClick={retry}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Retry Analysis
            </Button>
          )}
        </div>
      )}

      {/* 3. Error Feedback */}
      {error && <ErrorBanner message={error} />}

      {/* 4. The Analysis Result (Historical or New) */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ResultPanel result={result} />

          {/* Clean "Back" button to return to input mode */}
          <div className="flex justify-center pt-4">
            <button
              onClick={reset}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2"
            >
              ← Analyze another log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
