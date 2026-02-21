import React from "react";
import type { PipelineExecution } from "./useSse";

interface PipelineRowProps {
  p: PipelineExecution;

  onViewFix: (analysis: PipelineExecution["analysis"]) => void;
}

const PipelineRow: React.FC<PipelineRowProps> = ({ p, onViewFix }) => {
  const statusStyles: Record<string, string> = {
    PROCESSING: "bg-amber-900/20 text-amber-500 border-amber-500/30",
    COMPLETED: "bg-emerald-900/20 text-emerald-500 border-emerald-500/30",
    FAILED: "bg-rose-900/20 text-rose-500 border-rose-500/30",
  };

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="py-4 px-4">
        <div className="font-medium text-slate-200">{p.pipelineName}</div>
        <div className="text-xs text-slate-500 font-mono">
          {p.id.substring(0, 8)}...
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold border ${
            statusStyles[p.status] || "bg-slate-700 text-slate-300"
          }`}
        >
          {p.status}
        </span>
      </td>
      <td className="py-4 px-4 font-mono text-sm text-center">
        <div className="flex items-center justify-center space-x-4">
          <span
            className={
              p.cpuUsage > 80
                ? "text-rose-400 animate-pulse font-bold"
                : "text-slate-300"
            }
          >
            {p.cpuUsage || 0}% CPU
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">{p.memUsage || 0} MB</span>
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        {p.status === "FAILED" && (
          <button
            onClick={() => onViewFix(p.analysis)}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition shadow-lg shadow-blue-900/20 active:scale-95"
          >
            View Fix
          </button>
        )}
      </td>
    </tr>
  );
};

export default PipelineRow;
