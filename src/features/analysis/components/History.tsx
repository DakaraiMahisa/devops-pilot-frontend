import React, { useState } from "react";
import type { PipelineExecution } from "../../monitor/useSse";
import { useSse } from "../../monitor/useSse";
import PipelineRow from "../../monitor/PipelineRow";
import AnalysisModal from "../../monitor/AnalysisModal";
import { fetchAnalysisById } from "../api/analysis.api";

const History: React.FC = () => {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Use the updated hook with pagination and date support
  const { pipelines, loading, totalPages } = useSse({
    includeHistory: true,
    page: currentPage,
    limit: 10,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const [selectedAnalysis, setSelectedAnalysis] = useState<
    PipelineExecution["analysis"] | null
  >(null);
  const [isFetching, setIsFetching] = useState(false);

  // --- Derived Data ---
  // Note: For large datasets, stats should ideally come from a separate summary API endpoint
  const totalBuilds = pipelines.length;
  const failedBuilds = pipelines.filter((p) => p.status === "FAILED").length;
  const successRate =
    totalBuilds > 0
      ? Math.round(((totalBuilds - failedBuilds) / totalBuilds) * 100)
      : 0;

  // Filter local results based on UI inputs
  const filteredPipelines = pipelines.filter((p) => {
    const matchesSearch = p.pipelineName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Handlers ---
  const handleViewFix = async (execution: PipelineExecution) => {
    // 1. Check if analysis is already embedded in the execution object
    if (execution.analysis) {
      setSelectedAnalysis(execution.analysis);
      return;
    }

    // 2. If we only have an ID, fetch it
    if (execution.analysisId) {
      try {
        setIsFetching(true);
        const data = await fetchAnalysisById(execution.analysisId);

        if (!data) {
          throw new Error("Empty response from server");
        }

        setSelectedAnalysis(data);
      } catch (err) {
        console.error("Error loading fix:", err);

        alert(
          "Analysis report not found. This can happen if the build history was cleared " +
            "or the AI is still processing the logs.",
        );
      } finally {
        setIsFetching(false);
      }
    } else {
      alert("No AI analysis is available for this execution.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setDateRange({ start: "", end: "" });
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">📜</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Execution History
            </h2>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            Audit past runs and review AI-suggested fixes.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 p-1.5 rounded-xl">
            <input
              type="date"
              className="bg-transparent text-slate-300 text-sm focus:outline-none px-2 cursor-pointer"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange((prev) => ({ ...prev, start: e.target.value }));
                setCurrentPage(0);
              }}
            />
            <span className="text-slate-600 text-xs font-bold">TO</span>
            <input
              type="date"
              className="bg-transparent text-slate-300 text-sm focus:outline-none px-2 cursor-pointer"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange((prev) => ({ ...prev, end: e.target.value }));
                setCurrentPage(0);
              }}
            />
          </div>

          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-900/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="bg-slate-900/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="FAILED">Failed</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
          </select>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Page Results",
            value: totalBuilds,
            color: "text-blue-400",
            bg: "bg-blue-500/5",
          },
          {
            label: "Success Rate",
            value: `${successRate}%`,
            color: "text-emerald-400",
            bg: "bg-emerald-500/5",
          },
          {
            label: "Failures (Page)",
            value: failedBuilds,
            color: "text-rose-400",
            bg: "bg-rose-500/5",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} border border-slate-800/50 p-6 rounded-2xl`}
          >
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table & Pagination Container */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
        {loading ? (
          <div className="p-32 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
            <p className="mt-4 text-slate-400 font-medium tracking-wide">
              Retrieving build archives...
            </p>
          </div>
        ) : filteredPipelines.length > 0 ? (
          <>
            {/* Custom Scrollbar Wrapper */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-slate-950/30 border-b border-slate-800 uppercase text-[10px] tracking-[0.2em] text-slate-500 font-black">
                    <th className="p-5 px-8">Pipeline & ID</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-center">Resources</th>
                    <th className="p-5 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredPipelines.map((p) => (
                    <PipelineRow
                      key={p.id}
                      p={p}
                      onViewFix={() => handleViewFix(p)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Seamless Pagination Footer */}
            <div className="p-5 px-8 bg-slate-950/60 border-t border-slate-800/50 flex items-center justify-between">
              <p className="text-slate-500 text-xs font-medium tracking-wide">
                Showing Page{" "}
                <span className="text-blue-400 font-bold">
                  {currentPage + 1}
                </span>{" "}
                of <span className="text-slate-300">{totalPages || 1}</span>
              </p>
              <div className="flex gap-3">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-5 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-[10px] font-black tracking-widest rounded-lg disabled:opacity-10 transition-all border border-slate-700/50"
                >
                  PREVIOUS
                </button>
                <button
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black tracking-widest rounded-lg disabled:opacity-10 transition-all shadow-lg shadow-blue-900/20"
                >
                  NEXT
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-32 text-center space-y-4">
            <div className="text-5xl opacity-20">📂</div>
            <p className="text-slate-500 text-lg italic">
              No executions found for this period.
            </p>
            <button
              onClick={resetFilters}
              className="text-blue-500 hover:text-blue-400 text-sm font-semibold underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Overlays & Modals */}
      {isFetching && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-9999 flex flex-col items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
          <p className="text-white font-medium animate-pulse tracking-widest uppercase text-xs">
            Fetching AI Analysis...
          </p>
        </div>
      )}

      <AnalysisModal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />
    </div>
  );
};
export default History;
