import { useState } from "react";
import { startAnalysis } from "./api";
import { useAnalysisSse } from "@/features/sse/useAnalysisSse";
import type { AnalysisStatusChangedEvent } from "@/shared/types";

export function AnalysisForm() {
  const [logText, setLogText] = useState("");
  const [pipelineType, setPipelineType] = useState("GITHUB_ACTIONS");

  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE");
  const [summary, setSummary] = useState<string | null>(null);

  useAnalysisSse(analysisId, (event: AnalysisStatusChangedEvent) => {
    setStatus(event.status);

    if (event.status === "COMPLETED") {
      setSummary(event.summary ?? null);
    }

    if (event.status === "FAILED") {
      setSummary(event.message ?? "Analysis failed");
    }
  });

  const handleSubmit = async () => {
    if (logText.trim().length < 20) {
      setStatus("FAILED");
      setSummary("Log must be at least 20 characters.");
      return;
    }

    setStatus("STARTING");
    setSummary(null);

    try {
      const response = await startAnalysis(logText, pipelineType);
      setAnalysisId(response.analysisId);
    } catch (error) {
      console.error(error);
      setStatus("FAILED");
      setSummary("Failed to start analysis");
    }
  };

  return (
    <div>
      <h2>Log Analysis</h2>

      <div>
        <label>Pipeline Type: </label>
        <select
          value={pipelineType}
          onChange={(e) => setPipelineType(e.target.value)}
        >
          <option value="GITHUB_ACTIONS">GitHub Actions</option>
          <option value="GITLAB">GitLab</option>
          <option value="JENKINS">Jenkins</option>
          <option value="DOCKER">Docker CI/CD</option>
        </select>
      </div>

      <br />

      <textarea
        value={logText}
        onChange={(e) => setLogText(e.target.value)}
        rows={10}
        cols={80}
        placeholder="Paste CI/CD log here..."
      />

      <br />

      <button
        onClick={handleSubmit}
        disabled={status === "STARTING" || status === "PROCESSING"}
      >
        {status === "STARTING" || status === "PROCESSING"
          ? "Analyzing..."
          : "Analyze"}
      </button>

      <h3>Status: {status}</h3>

      {summary && <pre>{summary}</pre>}
    </div>
  );
}
