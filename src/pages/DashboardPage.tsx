import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../features/analysis/context/useTheme";
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
  const { mode } = useTheme();
  const isIndigo = mode === "INTELLIGENCE";

  // Dynamic Theme Constants for Logic and Styles
  const themeColor = isIndigo ? "#6366f1" : "#10b981";
  const themeBg = isIndigo ? "bg-slate-950" : "bg-zinc-950";
  const themeBorder = isIndigo ? "border-slate-800" : "border-zinc-800";
  const themeAccent = isIndigo ? "text-indigo-400" : "text-emerald-400";
  const themeButton = isIndigo
    ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40"
    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40";

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
      const [categories, pipelines, trends, confidence] = await Promise.all([
        getCategoryStats(range),
        getPipelineStats(range),
        getTrendStats(range),
        getConfidenceStats(range),
      ]);
      setStats({ categories, pipelines, trends, confidence });
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
      <div
        className={`p-8 animate-pulse ${themeAccent} font-black uppercase tracking-widest flex items-center gap-3`}
      >
        <div className="w-2 h-2 rounded-full bg-current animate-ping" />
        Syncing Neural Analytics...
      </div>
    );

  return (
    <div
      className={`min-h-screen ${themeBg} p-6 lg:p-10 space-y-8 text-slate-200 transition-colors duration-700`}
    >
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                isIndigo
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isIndigo ? "bg-indigo-400" : "bg-emerald-400"}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${isIndigo ? "bg-indigo-500" : "bg-emerald-500"}`}
                ></span>
              </span>
              {isIndigo ? "Intelligence Feed" : "Operations Hub"}
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Fleet <span className={themeAccent}>Analytics</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className={`bg-black/40 border ${themeBorder} text-white px-4 py-2 rounded-xl outline-none focus:ring-2 transition-all ${isIndigo ? "focus:ring-indigo-500/50" : "focus:ring-emerald-500/50"}`}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className={`px-6 py-2 ${themeButton} text-white text-[10px] font-black rounded-xl disabled:opacity-50 transition-all shadow-lg uppercase tracking-widest`}
          >
            {loading ? "Re-Syncing..." : "Refresh Engine"}
          </button>
        </div>
      </div>

      {/* 2. Failure Volume Trend Chart */}
      <div
        className={`bg-black/20 border ${themeBorder} p-8 rounded-4xl backdrop-blur-md shadow-2xl transition-colors duration-500`}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
            Anomaly Probability Trend
          </h3>
          <span className="text-[10px] font-mono text-slate-500 tracking-tighter">
            DATASET_ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}
          </span>
        </div>
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
                tick={{ fill: "#64748b", fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  borderRadius: "12px",
                  border: `1px solid ${themeColor}`,
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={themeColor}
                strokeWidth={4}
                dot={{ r: 4, fill: themeColor, strokeWidth: 2, stroke: "#000" }}
                activeDot={{ r: 8, strokeWidth: 0, fill: themeColor }}
                className="transition-all duration-700"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Log Analysis",
            val: total.toLocaleString(),
            color: "text-white",
          },
          {
            label: "Active Pipeline",
            val: stats.pipelines[0]?.pipelineType || "Stable",
            color: themeAccent,
          },
          {
            label: "Critical Vector",
            val: primaryIssue.replace(/_/g, " "),
            color: "text-rose-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-black/20 border ${themeBorder} p-6 rounded-3xl backdrop-blur-md hover:bg-black/40 transition-all`}
          >
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">
              {stat.label}
            </p>
            <p
              className={`text-3xl font-black italic tracking-tighter uppercase ${stat.color}`}
            >
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* 4. Distribution and AI Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* Error Distribution Bar HUD */}
        <div
          className={`bg-black/20 border ${themeBorder} p-8 rounded-4xl backdrop-blur-md`}
        >
          <h3 className="text-xs font-black text-white mb-8 uppercase tracking-[0.3em]">
            Failure Distribution
          </h3>
          <div className="space-y-6">
            {stats.categories.map((item) => (
              <div key={item.category} className="group">
                <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
                  <span className="text-slate-400 group-hover:text-white transition-colors">
                    {item.category?.replace(/_/g, " ")}
                  </span>
                  <span className={themeAccent}>{item.count} EVENTS</span>
                </div>
                <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div
                    className={`${isIndigo ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]"} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Confidence Matrix */}
        <div
          className={`bg-black/20 border ${themeBorder} p-8 rounded-4xl backdrop-blur-md`}
        >
          <h3 className="text-xs font-black text-white mb-8 uppercase tracking-[0.3em]">
            Neural Confidence
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.confidence.map((conf) => (
              <div
                key={conf.category}
                className={`p-6 bg-black/40 rounded-2xl border ${themeBorder} group hover:scale-[1.02] transition-all`}
              >
                <p
                  className={`text-[9px] text-slate-500 uppercase font-black mb-2 tracking-widest group-hover:${themeAccent}`}
                >
                  {conf.category?.replace(/_/g, " ")}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white italic">
                    {(conf.averageConfidence * 100).toFixed(0)}
                  </span>
                  <span className={`text-sm font-black ${themeAccent}`}>%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
