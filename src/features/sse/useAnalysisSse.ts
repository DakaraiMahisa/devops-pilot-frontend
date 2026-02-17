import { useEffect, useRef } from "react";
import { subscribeToAnalysis } from "./AnalysisSseService";
import type { AnalysisStatusChangedEvent } from "@/shared/types";

export function useAnalysisSse(
  analysisId: string | null,
  onEvent: (event: AnalysisStatusChangedEvent) => void,
) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!analysisId) return;

    const unsubscribe = subscribeToAnalysis(analysisId, (event) =>
      onEventRef.current(event),
    );

    return () => unsubscribe();
  }, [analysisId]);
}
