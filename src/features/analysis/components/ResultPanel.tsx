import type { LogAnalysisRecord } from "../types";

interface Props {
  result: LogAnalysisRecord;
}

export function ResultPanel({ result }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Category Badge */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Analysis Results</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
          {result.errorCategory || "Uncategorized"}
        </span>
      </div>

      <div className="p-6 space-y-8">
        {/* Summary Section */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Summary
            </h3>
          </div>
          <p className="text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            {result.summary}
          </p>
        </section>

        {/* Root Cause Section */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-amber-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Root Cause
            </h3>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {result.rootCause}
          </p>
        </section>

        {/* Suggested Fixes Section */}
        {result.suggestedFixes && result.suggestedFixes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-1 bg-green-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Suggested Fixes
              </h3>
            </div>
            <ul className="grid gap-3">
              {result.suggestedFixes.map((fix, index) => (
                <li
                  key={index}
                  className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 text-sm items-start"
                >
                  <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-700 font-bold text-[10px]">
                    {index + 1}
                  </span>
                  {fix}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
