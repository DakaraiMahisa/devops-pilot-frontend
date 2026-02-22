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
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time pipeline failure intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-slate-900/50 border border-slate-800 text-white px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-900/20"
          >
            {loading ? "REFRESHING..." : "REFRESH"}
          </button>
        </div>
      </div>

      {/* Failure Volume Trend Chart */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-md shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
          Failure Volume Trend
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.trends}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#1e293b"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "16px",
                  border: "1px solid #1e293b",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  color: "#f8fafc",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={4}
                dot={{
                  r: 4,
                  fill: "#6366f1",
                  strokeWidth: 2,
                  stroke: "#0f172a",
                }}
                activeDot={{ r: 8, strokeWidth: 0, fill: "#818cf8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Log Hits", val: total, color: "text-white" },
          {
            label: "Top Pipeline",
            val: stats.pipelines[0]?.pipelineType || "N/A",
            color: "text-blue-400",
          },
          {
            label: "Primary Issue",
            val: primaryIssue.replace(/_/g, " "),
            color: "text-rose-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-md shadow-xl"
          >
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {stat.label}
            </p>
            <p className={`text-3xl font-black mt-2 capitalize ${stat.color}`}>
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Distribution */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Error Distribution
          </h3>
          <div className="space-y-6">
            {stats.categories.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300 uppercase tracking-widest">
                    {item.category?.replace(/_/g, " ")}
                  </span>
                  <span className="text-indigo-400 font-mono">
                    {item.count} logs
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    style={{
                      width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            AI Confidence Analysis
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.confidence.map((conf) => (
              <div
                key={conf.category}
                className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50 group hover:border-indigo-500/50 transition-colors"
              >
                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest group-hover:text-indigo-400 transition-colors">
                  {conf.category?.replace(/_/g, " ")}
                </p>
                <p className="text-3xl font-black text-white italic">
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
