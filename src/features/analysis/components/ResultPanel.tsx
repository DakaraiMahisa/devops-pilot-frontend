import type { LogAnalysisRecord } from "../types";

interface Props {
  result: LogAnalysisRecord;
}

export function ResultPanel({ result }: Props) {
  return (
    <div>
      <h3>Summary</h3>
      <p>{result.summary}</p>

      <h3>Root Cause</h3>
      <p>{result.rootCause}</p>
    </div>
  );
}
