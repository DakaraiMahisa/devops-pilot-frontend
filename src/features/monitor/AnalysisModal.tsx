import React, { useState } from "react"; // Added useState
import type { PipelineExecution } from "./useSse";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PipelineExecution["analysis"] | null | undefined;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [copied, setCopied] = useState(false); // Track copy state

  if (!isOpen || !analysis) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.suggestedFixes[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header... (same as before) */}

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Summary and Root Cause... (same as before) */}

          <div>
            <h4 className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-2">
              Suggested Fix
            </h4>
            {/* ADDED 'group' and 'relative' HERE */}
            <div className="group relative bg-slate-950 rounded-lg p-4 font-mono text-sm text-emerald-400 border border-slate-800">
              {analysis.suggestedFixes[0]}

              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-all duration-200"
                title="Copy to clipboard"
              >
                {copied ? "✅" : "📋"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
