import React, { useState } from "react";
import {
  Play,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Terminal,
  X,
} from "lucide-react";
import { useOrchestration } from "../analysis/hooks/useOrchestration";
import { type TaskStatus, type TaskPriority } from "../analysis/types";
import { LiveConsole } from "./LiveConsole";

export function TaskOrchestrationTable() {
  const { tasks, loading, handleTriggerFix, logs } = useOrchestration();

  // Sticky state to prevent "flashing" when a task finishes
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-zinc-800/60">
        <div className="flex flex-col items-center gap-3">
          <Clock className="text-emerald-500 animate-spin" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Syncing with Ops Engine...
          </p>
        </div>
      </div>
    );
  }

  const toggleConsole = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const onTriggerFix = (taskId: string) => {
    setExpandedTaskId(taskId); // Ensure console opens and stays open
    handleTriggerFix(taskId);
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
      <div className="px-8 py-6 border-b border-zinc-800/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight uppercase flex items-center gap-2">
            <Users size={18} className="text-emerald-500" />
            Active Orchestrations
          </h3>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">
            Total: {tasks.length} Live Workflows
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
            Live Sync: Active
          </span>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-950/50">
            <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Task Identity
            </th>
            <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Priority
            </th>
            <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Collaborator
            </th>
            <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Status
            </th>
            <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Execution
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/30">
          {tasks.map((task) => {
            const isConsoleOpen =
              expandedTaskId === task.id || task.status === "IN_PROGRESS";
            const taskLogs = logs[task.id] || [];

            return (
              <React.Fragment key={task.id}>
                <tr
                  className={`group transition-colors ${isConsoleOpen ? "bg-emerald-500/5" : "hover:bg-emerald-500/2"}`}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                        {task.taskIdentity}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase">
                        {task.requestId} • {task.timeAgo}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-2 py-1 rounded-md text-[9px] font-black border ${getPriorityStyles(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-zinc-400 font-bold text-xs">
                    {task.collaborator}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {renderStatusIcon(task.status)}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-tight ${getStatusTextColor(task.status)}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleConsole(task.id)}
                        className={`p-2 rounded-lg transition-colors ${isConsoleOpen ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 hover:bg-zinc-800"}`}
                      >
                        <Terminal size={14} />
                      </button>

                      {task.status === "COMPLETED" ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black">
                          <CheckCircle size={12} /> DEPLOYED
                        </div>
                      ) : (
                        <button
                          onClick={() => onTriggerFix(task.id)}
                          disabled={task.status === "IN_PROGRESS"}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black transition-all 
                            ${
                              task.status === "IN_PROGRESS"
                                ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
                                : "bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border-emerald-500/20"
                            }`}
                        >
                          <Play
                            size={12}
                            fill="currentColor"
                            className={
                              task.status === "IN_PROGRESS"
                                ? "animate-spin"
                                : ""
                            }
                          />
                          {task.status === "IN_PROGRESS"
                            ? "EXECUTING..."
                            : "TRIGGER FIX"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {isConsoleOpen && (
                  <tr className="bg-black/40 border-x border-emerald-500/10">
                    <td colSpan={5} className="px-8 py-4">
                      <div className="animate-in fade-in zoom-in-95 duration-300 relative">
                        {/* Use of X import for manual dismissal */}
                        <button
                          onClick={() => setExpandedTaskId(null)}
                          className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-zinc-400 z-20"
                          title="Close Console"
                        >
                          <X size={16} />
                        </button>

                        <LiveConsole
                          logs={taskLogs}
                          activeTaskIdentity={task.taskIdentity}
                        />

                        {task.status === "COMPLETED" && (
                          <div className="mt-2 flex items-center justify-between px-4 py-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase">
                              <CheckCircle size={10} /> Session Finalized
                            </div>
                            <button
                              onClick={() => setExpandedTaskId(null)}
                              className="text-[9px] font-black text-zinc-500 hover:text-emerald-500 uppercase"
                            >
                              Clear Terminal
                            </button>
                          </div>
                        )}
                        {task.status === "FAILED" && (
                          <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-lg text-[10px] font-mono uppercase">
                            <AlertCircle size={10} /> Execution Halted - Check
                            logs for errors
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- Helpers ---

function getPriorityStyles(priority: TaskPriority) {
  switch (priority) {
    case "CRITICAL":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "HIGH":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    default:
      return "bg-zinc-800 text-zinc-400 border-zinc-700";
  }
}

function renderStatusIcon(status: TaskStatus) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle size={14} className="text-emerald-500" />;
    case "IN_PROGRESS":
      return <Clock size={14} className="text-amber-500 animate-spin" />;
    case "FAILED":
      return <AlertCircle size={14} className="text-rose-500" />;
    default:
      return <Clock size={14} className="text-zinc-500" />;
  }
}

function getStatusTextColor(status: TaskStatus) {
  switch (status) {
    case "COMPLETED":
      return "text-emerald-500";
    case "IN_PROGRESS":
      return "text-amber-500";
    case "FAILED":
      return "text-rose-500";
    default:
      return "text-zinc-400";
  }
}
