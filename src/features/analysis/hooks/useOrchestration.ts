import { useState, useEffect, useCallback, useRef } from "react";
import { getActiveTasks, triggerFix } from "../api/orchestration.api";
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

  useEffect(() => {
    fetchTasks();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const eventSource = new EventSource(
      `${API_BASE.replace(/\/$/, "")}/api/sse/stream`,
    );

    eventSource.addEventListener("notification", () => {
      setTimeout(() => {
        // Clear the sticky lock
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

  return {
    tasks,
    loading,
    logs,
    handleTriggerFix,
    refresh: fetchTasks,
  };
};
