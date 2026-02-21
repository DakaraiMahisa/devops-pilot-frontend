import React, { useState } from "react";
import type { PipelineExecution } from "./useSse";
import { useSse } from "./useSse";
import PipelineRow from "./PipelineRow";
import AnalysisModal from "./AnalysisModal";

/**
 * PipelineDashboard Component
 * Manages live stream data and handles the display of AI analysis modals.
 */
const PipelineDashboard: React.FC = () => {
  const pipelines: PipelineExecution[] = useSse();

  // State to track which analysis is active for the modal
  const [selectedAnalysis, setSelectedAnalysis] = useState<
    PipelineExecution["analysis"] | null
  >(null);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="animate-pulse">🚀</span> Live Pipeline Monitor
          </h2>
          <p className="text-slate-400 mt-1">
            Real-time build status and resource tracking
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <div
            className={`h-2 w-2 rounded-full ${
              pipelines.length > 0
                ? "bg-emerald-500 animate-pulse"
                : "bg-amber-500"
            }`}
          />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
            {pipelines.length > 0
              ? "Stream Connected"
              : "Waiting for builds..."}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
              <th className="px-6 py-4 font-semibold">Pipeline & ID</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">
                Resource Utilization
              </th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pipelines.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center text-slate-500 italic"
                >
                  No active pipelines detected. Start a build to see live data.
                </td>
              </tr>
            ) : (
              pipelines.map((p: PipelineExecution) => (
                <PipelineRow
                  key={p.id}
                  p={p}
                  onViewFix={(analysis) => setSelectedAnalysis(analysis)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AI Analysis Modal */}
      <AnalysisModal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />
    </div>
  );
};

export default PipelineDashboard;
