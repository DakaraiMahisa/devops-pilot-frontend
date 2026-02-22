import type { LogAnalysisRecord } from "../types";

interface Props {
  result: LogAnalysisRecord;
}

export function ResultPanel({ result }: Props) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Glass Effect */}
      <div className="bg-slate-950/40 border-b border-slate-800/50 px-8 py-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            ANALYSIS REPORT
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            ID: {result.id.slice(0, 8)}...
          </p>
        </div>
        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-[0.2em]">
          {result.errorCategory || "Uncategorized"}
        </span>
      </div>

      <div className="p-8 space-y-10">
        {/* Summary Section - Highlighted Box */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Executive Summary
            </h3>
          </div>
          <div className="text-slate-200 leading-relaxed bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 italic text-lg">
            "{result.summary}"
          </div>
        </section>

        {/* Root Cause Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Root Cause Identification
            </h3>
          </div>
          <div className="text-slate-400 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-slate-800 ml-1">
            {result.rootCause}
          </div>
        </section>

        {/* Suggested Fixes Section - Terminal Style */}
        {result.suggestedFixes && result.suggestedFixes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Proposed Remediations
              </h3>
            </div>

            {/* Terminal Window Wrapper */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
              {/* Terminal Title Bar */}
              <div className="bg-slate-900/80 px-4 py-2 flex items-center gap-1.5 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Fix_Suggestions.sh
                </span>
              </div>

              <ul className="p-6 space-y-4">
                {result.suggestedFixes.map((fix, index) => (
                  <li key={index} className="flex gap-4 group">
                    <span className="shrink-0 font-mono text-indigo-500/50 text-sm">
                      0{index + 1}
                    </span>
                    <div className="text-slate-300 text-sm font-mono leading-relaxed group-hover:text-emerald-400 transition-colors">
                      <span className="text-emerald-500 mr-2">$</span>
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
