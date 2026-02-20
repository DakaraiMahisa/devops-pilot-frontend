import { useReducer, useCallback, useRef, useEffect } from "react";
import { createAnalysis, getAnalysis } from "../api/analysis.api";
import { useAnalysisSse } from "./useAnalysisSse";
import type { AnalysisStatus, LogAnalysisRecord } from "../types";
import { useSearchParams } from "react-router-dom";
import { getAnalysisById } from "../api/analysis.api";

type UiStatus = AnalysisStatus | "IDLE";

interface State {
  status: UiStatus;
  analysisId: string | null;
  result: LogAnalysisRecord | null;
  error: string | null;
}

type Action =
  | { type: "START_REQUEST" }
  | { type: "START_SUCCESS"; id: string }
  | { type: "STATUS_UPDATE"; status: AnalysisStatus }
  | { type: "SET_RESULT"; result: LogAnalysisRecord }
  | { type: "LOAD_HISTORY"; result: LogAnalysisRecord }
  | { type: "FAIL"; error: string }
  | { type: "RESET" };

const initialState: State = {
  status: "IDLE",
  analysisId: null,
  result: null,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_REQUEST":
      return {
        ...state,
        status: "PROCESSING",
        error: null,
        result: null,
      };

    case "START_SUCCESS":
      return {
        ...state,
        analysisId: action.id,
      };

    case "STATUS_UPDATE":
      return { ...state, status: action.status };

    case "SET_RESULT":
      return { ...state, status: "COMPLETED", result: action.result };

    case "LOAD_HISTORY":
      return {
        ...state,
        status: "COMPLETED",
        analysisId: action.result.id,
        result: action.result,
        error: null,
      };
    case "FAIL":
      return { ...state, status: "FAILED", error: action.error };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [searchParams] = useSearchParams();
  const historyId = searchParams.get("id");

  const activeIdRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (historyId) {
      // Avoid refetching if we are already showing this ID
      if (state.analysisId === historyId) return;

      const fetchHistory = async () => {
        try {
          const record = await getAnalysisById(historyId);
          if (isMountedRef.current) {
            dispatch({ type: "LOAD_HISTORY", result: record });
          }
        } catch (err) {
          console.error("History fetch failed:", err);
          dispatch({ type: "FAIL", error: "Could not load report." });
        }
      };

      fetchHistory();
    }
  }, [historyId, state.analysisId]);

  const { connect, disconnect } = useAnalysisSse({
    onStatusUpdate: async (analysisId, status, failureReason) => {
      if (analysisId !== activeIdRef.current) return;
      if (status === "COMPLETED") {
        try {
          const result = await getAnalysis(analysisId);
          if (!isMountedRef.current) return;

          dispatch({ type: "SET_RESULT", result });
        } catch (err) {
          if (!isMountedRef.current) return;
          console.error("Analysis Error:", err);
          dispatch({ type: "FAIL", error: "Failed to load results." });
        } finally {
          disconnect();
        }
      } else if (status === "FAILED") {
        dispatch({ type: "FAIL", error: failureReason ?? "Analysis failed" });
        disconnect();
      } else {
        dispatch({ type: "STATUS_UPDATE", status });
      }
    },
  });

  // cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  const startAnalysis = useCallback(
    async (pipelineType: string, logText: string) => {
      // Prevent double start
      if (state.status === "PROCESSING") {
        return;
      }

      dispatch({ type: "START_REQUEST" });

      try {
        const id = await createAnalysis(pipelineType, logText);

        activeIdRef.current = id;

        dispatch({ type: "START_SUCCESS", id });

        connect(id);
      } catch (err) {
        dispatch({
          type: "FAIL",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [connect, state.status],
  );

  const cancel = useCallback(() => {
    disconnect();
    activeIdRef.current = null;
    dispatch({ type: "RESET" });
  }, [disconnect]);

  const retry = useCallback(() => {
    if (!state.analysisId) return;

    activeIdRef.current = state.analysisId;
    dispatch({ type: "STATUS_UPDATE", status: "PROCESSING" });
    connect(state.analysisId);
  }, [connect, state.analysisId]);

  return {
    ...state,
    startAnalysis,
    cancel,
    retry,
    reset: () => dispatch({ type: "RESET" }),
  };
}
