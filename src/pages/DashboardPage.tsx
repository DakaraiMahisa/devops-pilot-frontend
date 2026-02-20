import { useEffect, useState } from "react";
import { getAnalysisHistory } from "../features/analysis/api/analysis.api";
import type { LogAnalysisRecord } from "@/features/analysis/types";

export default function DashboardPage() {
  const [data, setData] = useState<LogAnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the fetcher function
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const history = await getAnalysisHistory();
      setData(history);
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Only one useEffect is needed for the initial load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Aggregate Data for Cards
  const total = data.length;
  const successCount = data.filter((r) => r.status === "COMPLETED").length;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  const categoryCounts = data.reduce((acc: Record<string, number>, curr) => {
    const cat = curr.errorCategory || "UNCATEGORIZED";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  if (loading && data.length === 0)
    return (
      <div className="p-8 animate-pulse text-slate-500">
        Loading initial analytics...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">
            Overview of log analysis performance and common failures.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
              Refreshing...
            </>
          ) : (
            "Refresh Data"
          )}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Total Analyses
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Success Rate
          </p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {successRate}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Primary Issue
          </p>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {Object.keys(categoryCounts).length > 0
              ? Object.keys(categoryCounts).sort(
                  (a, b) => categoryCounts[b] - categoryCounts[a],
                )[0]
              : "None"}
          </p>
        </div>
      </div>

      {/* Category Breakdown Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Error Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(categoryCounts).map(([name, count]) => (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{name}</span>
                <span className="text-slate-500">{count} occurrences</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(count / total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
