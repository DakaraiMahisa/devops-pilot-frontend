import { useEffect, useState, useCallback } from "react";
import {
  searchHistory,
  deleteAnalyses,
} from "../features/analysis/api/analysis.api";
import { AnalysisHistoryTable } from "../features/analysis/components/AnalysisHistoryTable";
import type { LogAnalysisRecord } from "../features/analysis/types";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [history, setHistory] = useState<LogAnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  // Filter and Pagination State (Page starts at 0 for Backend sync)
  const [category, setCategory] = useState("");
  const [pipeline, setPipeline] = useState("");
  const [page, setPage] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await searchHistory({
        errorCategory: category || undefined,
        pipelineType: pipeline || undefined,
        page: page, // Use state directly (0-indexed)
        size: 10,
      });
      setHistory(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Search failed:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, pipeline, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewDetails = (id: string) => {
    navigate(`/analysis/new?id=${id}`);
  };

  const handleReset = () => {
    setCategory("");
    setPipeline("");
    setPage(0);
    setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} records?`)) return;
    try {
      await deleteAnalyses(selectedIds);
      setSelectedIds([]);
      loadData();
    } catch (error) {
      console.log("Deletion failed", error);
      alert("Deletion failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 space-y-8 text-slate-200">
      {/* Header Area */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-slate-400 mt-1">
            Review and filter past AI log reports.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-900/20"
            >
              DELETE SELECTED ({selectedIds.length})
            </button>
          )}

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
              setSelectedIds([]);
            }}
            className="bg-slate-900/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All Categories</option>
            <option value="BUILD_CONFIGURATION">Build Configuration</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="UNKNOWN">Unknown</option>
          </select>

          <select
            value={pipeline}
            onChange={(e) => {
              setPipeline(e.target.value);
              setPage(0);
              setSelectedIds([]);
            }}
            className="bg-slate-900/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All Pipelines</option>
            <option value="LOG_ANALYSIS">Log Analysis</option>
            <option value="BUILD_FAILURE">Build Failure</option>
            <option value="DEPLOYMENT">Deployment</option>
          </select>

          <button
            onClick={handleReset}
            className="text-slate-500 hover:text-white text-sm font-medium px-2"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main Table Content */}
      <div className="relative">
        {isLoading ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-32 text-center backdrop-blur-md">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent" />
            <p className="mt-4 text-slate-400 font-medium">
              Scanning archives...
            </p>
          </div>
        ) : history.length > 0 ? (
          <AnalysisHistoryTable
            records={history}
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
            onViewDetails={handleViewDetails}
            // Sync with Table component
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              setSelectedIds([]);
            }}
          />
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-32 text-center backdrop-blur-md">
            <p className="text-slate-500 text-lg italic">
              No analysis records found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
