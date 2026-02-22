import { TaskOrchestrationTable } from "./TaskOrchestrationTable";
import { PulseSidebar } from "../analysis/components/PulseSidebar";
import { ArrowLeft, Plus, Globe } from "lucide-react";
import { useTheme } from "../analysis/context/useTheme";

export default function OrchestrationHub() {
  const { setMode } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-950 p-6 lg:p-10 text-zinc-200 animate-in fade-in duration-700">
      <div className="max-w-400 mx-auto space-y-8">
        {/* Module Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                System Healthy • Live Command
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Task <span className="text-emerald-500">Orchestration</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigational Bridge back to Analysis */}
            <button
              onClick={() => setMode("INTELLIGENCE")}
              className="group flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-all shadow-lg shadow-black/40"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              BACK TO AI ENGINE
            </button>

            <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
              <Plus size={14} />
              NEW TEAM TASK
            </button>
          </div>
        </header>

        {/* Main Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Task View (Left & Center) */}
          <div className="lg:col-span-8 xl:col-span-9">
            <TaskOrchestrationTable />
          </div>

          {/* Activity & Presence (Right Sidebar) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Real-time SSE Pulse Feed */}
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl overflow-hidden backdrop-blur-sm">
              <PulseSidebar />
            </div>

            {/* Team Presence Card */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Active Collaborators
                </h3>
                <Globe size={12} className="text-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-4">
                {["Alex Rivera", "Sarah Chen", "Gemini AI"].map((user) => (
                  <div
                    key={user}
                    className="flex items-center justify-between group cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-emerald-500 group-hover:border-emerald-500/50 transition-colors">
                          {user[0]}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-[0_0_5px_#10b981]" />
                      </div>
                      <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {user}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-500/50 group-hover:text-emerald-500 transition-colors">
                      ON-LINE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
