import { useEffect, useState, useCallback } from "react";
import {
  getCategoryStats,
  getPipelineStats,
  getTrendStats,
  getConfidenceStats,
} from "../features/analysis/api/analytics.api";
import type {
  CategoryStat,
  ConfidenceStat,
  DailyTrendStat,
  PipelineStat,
} from "../features/analysis/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    categories: [] as CategoryStat[],
    pipelines: [] as PipelineStat[],
    trends: [] as DailyTrendStat[],
    confidence: [] as ConfidenceStat[],
  });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7");

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel fetch passing the 'range' state
      const [categories, pipelines, trends, confidence] = await Promise.all([
        getCategoryStats(range),
        getPipelineStats(range),
        getTrendStats(range),
        getConfidenceStats(range),
      ]);

      setStats({
        categories,
        pipelines,
        trends,
        confidence,
      });
    } catch (err) {
      console.error("Failed to refresh analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  const total = stats.categories.reduce((sum, item) => sum + item.count, 0);

  const primaryIssue =
    stats.categories.length > 0
      ? [...stats.categories].sort((a, b) => b.count - a.count)[0].category
      : "None";

  if (loading && total === 0)
    return (
      <div className="p-8 animate-pulse text-slate-500">
        Loading analytics engine...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header with Time Range Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500">
            Real-time pipeline failure intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* NEW: Range Selector Dropdown */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Failure Volume Trend Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Failure Volume Trend
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.trends}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-400 uppercase">
            Total Log Hits
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-400 uppercase">
            Top Pipeline
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.pipelines[0]?.pipelineType || "N/A"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-400 uppercase">
            Primary Issue
          </p>
          <p className="text-xl font-bold text-red-600 mt-2">
            {primaryIssue
              ?.replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()) || "None"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Error Distribution
          </h3>
          <div className="space-y-4">
            {stats.categories.map((item) => (
              <div key={item.category || Math.random().toString()}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {item.category?.replace(/_/g, " ") || "Uncategorized"}
                  </span>
                  <span className="text-slate-500">{item.count} logs</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Confidence by Category */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            AI Confidence Analysis
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.confidence.map((conf) => (
              <div
                key={conf.category}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  {conf.category?.replace(/_/g, " ")}
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {(conf.averageConfidence * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
