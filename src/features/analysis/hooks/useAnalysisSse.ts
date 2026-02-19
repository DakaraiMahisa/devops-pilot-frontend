import { useRef, useCallback } from "react";
import { subscribeToAnalysis } from "../api/analysis.sse";
import type { AnalysisStatus } from "../types";

interface Props {
  onStatusUpdate: (
    analysisId: string,
    status: AnalysisStatus,
    failureReason?: string,
  ) => void;
}

export function useAnalysisSse({ onStatusUpdate }: Props) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const retryRef = useRef(0);

  const MAX_RETRIES = 5;

  const disconnect = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    retryRef.current = 0;
    activeIdRef.current = null;
  }, []);

  const connect = useCallback(
    (analysisId: string) => {
      activeIdRef.current = analysisId;

      const subscribe = () => {
        unsubscribeRef.current = subscribeToAnalysis(
          analysisId,
          (event) => {
            if (event.analysisId !== activeIdRef.current) return;

            onStatusUpdate(event.analysisId, event.status, event.message);
          },
          () => {
            if (retryRef.current >= MAX_RETRIES) {
              disconnect();
              return;
            }

            retryRef.current += 1;

            const delay = Math.pow(2, retryRef.current) * 500;
            setTimeout(subscribe, delay);
          },
        );
      };

      subscribe();
    },
    [disconnect, onStatusUpdate],
  );

  return { connect, disconnect };
}
