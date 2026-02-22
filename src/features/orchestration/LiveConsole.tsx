import { useEffect, useRef } from "react";

export function LiveConsole({
  logs,
  activeTaskIdentity,
}: {
  logs: string[];
  activeTaskIdentity: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLineColor = (log: string) => {
    const lowerLog = log.toLowerCase();
    if (
      log.includes("❌") ||
      lowerLog.includes("error") ||
      lowerLog.includes("failed")
    ) {
      return "text-rose-400";
    }
    if (log.includes("⚠️") || lowerLog.includes("warning")) {
      return "text-amber-400";
    }
    if (
      log.includes("✅") ||
      log.includes("🚀") ||
      lowerLog.includes("success")
    ) {
      return "text-emerald-400";
    }
    return "text-emerald-400/80";
  };

  return (
    <div className="bg-black/90 rounded-xl border border-emerald-500/20 overflow-hidden shadow-2xl">
      {/* Console Header */}
      <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500/50" />
            <div className="w-2 h-2 rounded-full bg-amber-500/50" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">
            SENTINEL_AGENT // {activeTaskIdentity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            LIVE_STREAM
          </span>
        </div>
      </div>

      {/* Console Body */}
      <div
        ref={scrollRef}
        className="h-56 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div key={i} className="flex gap-3 mb-1 group">
              <span className="text-zinc-700 select-none w-4 text-right">
                {i + 1}
              </span>
              <span className={`${getLineColor(log)} break-all`}>{log}</span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-600 italic">
            <div className="animate-pulse">Establishing secure link...</div>
          </div>
        )}
        {/* Invisible anchor for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
