import type { AnalysisStatus } from "../types";

interface Props {
  status: AnalysisStatus | "IDLE";
}

export function StatusIndicator({ status }: Props) {
  return <div>Status: {status}</div>;
}
