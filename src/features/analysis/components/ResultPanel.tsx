import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { promoteToOps } from "../api/orchestration.api";
import { type LogAnalysisRecord } from "../types";
import {
  Loader2,
  Terminal,
  Info,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Props {
  result: LogAnalysisRecord;
}

export function ResultPanel({ result }: Props) {
  const { setMode } = useTheme();
  const navigate = useNavigate();
  const [isPromoting, setIsPromoting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simple progress bar simulator for the "Wait a bit" phase
  useEffect(() => {
    if (showSuccessOverlay && progress < 100) {
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 100));
      }, 20);
      return () => clearInterval(timer);
    }
  }, [showSuccessOverlay, progress]);

  const handlePromoteToTask = async () => {
    try {
      setIsPromoting(true);

      // 1. Await the actual API call.
      // The browser stays here until the server sends '200 OK' and commits to Mongo.
      await promoteToOps(result.id);

      // 2. Clear initial loading and show the Handshake Overlay
      setIsPromoting(false);
      setShowSuccessOverlay(true);

      // 3. Update Global UI Context
      setMode("OPERATIONS");

      // 4. THE GRACEFUL HANDOVER:
      // We wait 1.5s to let the backend finish its 'stream.complete()' logic
      // and let the user digest the transition.
      setTimeout(() => {
        navigate("/orchestration");
      }, 1500);
    } catch (error) {
      console.error("Promotion failed:", error);
      alert(
        "System Handover Failed: Ensure the Orchestration Service is online.",
      );
      setIsPromoting(false);
    }
  };

  return (
    <div className="relative bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SYSTEM HANDOVER OVERLAY */}
      {showSuccessOverlay && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-3xl bg-emerald-500/30 rounded-full animate-pulse" />
            <CheckCircle2
              size={64}
              className="text-emerald-500 relative z-10"
            />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tighter mb-2">
            PROMOTION SUCCESSFUL
          </h2>
          <p className="text-slate-400 text-sm max-w-70 mb-8">
            Analysis record moved to Orchestration Hub. Initializing live
            command center...
          </p>

          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between items-end px-1">
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                Transmitting Data
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {progress}%
              </span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-500 italic">
              Wait a bit... Finalizing SSE handshake
            </p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-slate-950/40 border-b border-slate-800/50 px-8 py-5 flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-white tracking-tight">
            ANALYSIS REPORT
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              ID: {result.id.slice(0, 12)}
            </p>
          </div>
        </div>

        <button
          onClick={handlePromoteToTask}
          disabled={isPromoting || showSuccessOverlay}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 group uppercase tracking-tighter"
        >
          {isPromoting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          )}
          {isPromoting ? "Initializing Ops..." : "Promote to Ops Hub"}
        </button>
      </div>

      {/* DATA FIELDS SECTION */}
      <div className="p-8 space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Info size={14} className="text-blue-500" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Executive Summary
            </h3>
          </div>
          <div className="text-slate-200 leading-relaxed bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 italic text-lg">
            "{result.summary}"
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Zap size={14} className="text-amber-500" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Root Cause Identification
            </h3>
          </div>
          <div className="text-slate-400 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-slate-800 ml-1">
            {result.rootCause}
          </div>
        </section>

        {result.suggestedFixes && result.suggestedFixes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Terminal size={14} className="text-emerald-500" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Proposed Remediations
              </h3>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500/20" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Fix_Manifest.log
                </span>
              </div>

              <ul className="p-6 space-y-4">
                {result.suggestedFixes.map((fix, index) => (
                  <li key={index} className="flex gap-4 group">
                    <span className="shrink-0 font-mono text-indigo-500/50 text-xs mt-1">
                      0{index + 1}
                    </span>
                    <div className="text-slate-300 text-sm font-mono leading-relaxed group-hover:text-emerald-400 transition-colors">
                      <span className="text-emerald-500 mr-2">❯</span>
                      {fix}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
