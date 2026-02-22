// features/shared/components/ModuleSwitcher.tsx
import { useTheme } from "../../analysis/context/useTheme"; // Import the global hook

export function ModuleSwitcher() {
  // Use global state instead of local useState
  const { mode, setMode } = useTheme();

  const activeModule = mode === "INTELLIGENCE" ? "intelligence" : "operations";

  return (
    <div className="px-4 mb-8">
      <div className="bg-zinc-950/50 border border-zinc-800 p-1.5 rounded-2xl flex items-center relative overflow-hidden">
        {/* Sliding Background Highlight */}
        <div
          className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-xl transition-all duration-300 ease-out shadow-lg
            ${
              activeModule === "intelligence"
                ? "left-1.5 bg-indigo-600/20 border border-indigo-500/30"
                : "left-[50%] bg-emerald-600/20 border border-emerald-500/30"
            }`}
        />

        <button
          onClick={() => setMode("INTELLIGENCE")}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300
            ${activeModule === "intelligence" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Engine
        </button>

        <button
          onClick={() => setMode("OPERATIONS")}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300
            ${activeModule === "operations" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Ops Hub
        </button>
      </div>

      {/* Sub-label showing current status */}
      <div className="mt-3 px-1 flex items-center justify-between">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
          Current Context
        </span>
        <span
          className={`text-[9px] font-black uppercase tracking-widest animate-pulse
          ${activeModule === "intelligence" ? "text-indigo-500" : "text-emerald-500"}`}
        >
          ●{" "}
          {activeModule === "intelligence"
            ? "Analysis Active"
            : "Orchestration Live"}
        </span>
      </div>
    </div>
  );
}
