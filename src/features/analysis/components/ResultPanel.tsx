import type { LogAnalysisRecord } from "../types";

interface Props {
  result: LogAnalysisRecord;
}

export function ResultPanel({ result }: Props) {
  return (
    <div
      style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc" }}
    >
      <h2>Analysis Results</h2>
      <h3>Summary</h3>
      <p>{result.summary}</p>

      <h3>Root Cause</h3>
      <p>{result.rootCause}</p>

      {result.suggestedFixes && result.suggestedFixes.length > 0 && (
        <>
          <h3>Suggested Fixes</h3>
          <ul>
            {result.suggestedFixes.map((fix, index) => (
              <li key={index}>{fix}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
