import { useState, useEffect, useCallback, useRef } from "react";
import { getActiveTasks, triggerFix, stopTask } from "../api/orchestration.api";
import { type OrchestrationTask, type TaskStatus } from "../types";

export const useOrchestration = () => {
  const [tasks, setTasks] = useState<OrchestrationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Record<string, string[]>>({});

  const executingTasks = useRef<Set<string>>(new Set());

  const fetchTasks = useCallback(async () => {
    try {
      const incomingData = await getActiveTasks();

      setTasks((prevTasks) => {
        const incomingMap = new Map(incomingData.map((t) => [t.id, t]));

        const updatedExisting = prevTasks.map((existing) => {
          const update = incomingMap.get(existing.id);

          if (update) {
            if (
              executingTasks.current.has(update.id) &&
              update.status === "COMPLETED"
            ) {
              return { ...update, status: "IN_PROGRESS" as TaskStatus };
            }
            return update;
          }

          // RETAIN COMPLETED TASKS: If task is missing from active list,
          // but was just running, keep it as COMPLETED so it doesn't vanish.
          if (
            existing.status === "IN_PROGRESS" ||
            executingTasks.current.has(existing.id)
          ) {
            return { ...existing, status: "COMPLETED" as TaskStatus };
          }

          return existing;
        });

        const brandNewTasks = incomingData.filter(
          (incoming) => !prevTasks.find((p) => p.id === incoming.id),
        );

        return [...updatedExisting, ...brandNewTasks];
      });
    } catch (err) {
      console.error("Failed to fetch orchestrations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // RE-SYNC LOGIC: If user switches tabs or server restarts, re-fetch the truth.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchTasks();
    };
    window.addEventListener("focus", fetchTasks);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", fetchTasks);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const eventSource = new EventSource(
      `${API_BASE.replace(/\/$/, "")}/api/sse/stream`,
    );

    eventSource.addEventListener("notification", () => {
      setTimeout(() => {
        executingTasks.current.clear();
        fetchTasks();
      }, 3000);
    });

    eventSource.addEventListener("agent-logs", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const { taskId, log } = data;

        setLogs((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), log],
        }));
      } catch (err) {
        console.error("Error parsing agent-logs:", err);
      }
    });

    return () => eventSource.close();
  }, [fetchTasks]);

  const handleTriggerFix = async (taskId: string) => {
    executingTasks.current.add(taskId);
    setLogs((prev) => ({
      ...prev,
      [taskId]: [
        "🚀 [SYSTEM] Initializing Sentinel execution environment...",
        "📡 [SYSTEM] Establishing secure SSE tunnel...",
      ],
    }));

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "IN_PROGRESS" } : t)),
    );

    try {
      await triggerFix(taskId);
    } catch (err) {
      console.error("Failed to trigger fix", err);
      executingTasks.current.delete(taskId);
      fetchTasks();
    }
  };

  const handleForceKill = async (taskId: string) => {
    try {
      // Optimistically update state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "FAILED" } : t)),
      );

      await stopTask(taskId);

      setLogs((prev) => ({
        ...prev,
        [taskId]: [
          ...(prev[taskId] || []),
          "🛑 [SYSTEM] Manual termination signal sent.",
        ],
      }));
    } catch (err) {
      console.error("Failed to kill process", err);
      fetchTasks();
    } finally {
      executingTasks.current.delete(taskId);
    }
  };

  return {
    tasks,
    loading,
    logs,
    handleTriggerFix,
    handleForceKill,
    refresh: fetchTasks,
  };
};
