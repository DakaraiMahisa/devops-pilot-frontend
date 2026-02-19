import { useAnalysis } from "../hooks/useAnalysis";
import { StatusIndicator } from "./StatusIndicator";
import { ResultPanel } from "./ResultPanel";
import { ErrorBanner } from "./ErrorBanner";
import AnalysisForm from "./AnalysisForm";

export function AnalysisContainer() {
  const { status, result, error, startAnalysis, cancel, retry } = useAnalysis();

  return (
    <div>
      <AnalysisForm onSubmit={startAnalysis} />

      <StatusIndicator status={status} />

      {status === "PROCESSING" && <button onClick={cancel}>Cancel</button>}

      {status === "FAILED" && <button onClick={retry}>Retry</button>}

      {error && <ErrorBanner message={error} />}
      {result && <ResultPanel result={result} />}
    </div>
  );
}
