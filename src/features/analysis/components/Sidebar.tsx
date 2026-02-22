import { NavLink } from "react-router-dom";
import { useAnalysisContext } from "../context/useAnalysisContext";
import { useTheme } from "../context/useTheme";
import { ModuleSwitcher } from "../../shared/components/ModuleSwitcher"; // Adjust path as necessary
import {
  LayoutDashboard,
  Activity,
  History,
  Search,
  ScrollText,
  Cpu,
  Layers,
} from "lucide-react";

export default function Sidebar() {
  const { status } = useAnalysisContext();
  const { mode } = useTheme();

  // Determine dynamic colors based on theme mode
  const isIndigo = mode === "INTELLIGENCE";
  const themeColorClass = isIndigo ? "text-indigo-500" : "text-emerald-500";
  const themeBorderClass = isIndigo ? "border-slate-800" : "border-zinc-800";
  const themeBgClass = isIndigo ? "bg-slate-900" : "bg-zinc-950";

  return (
    <aside
      className={`w-64 ${themeBgClass} text-white h-screen flex flex-col border-r ${themeBorderClass} transition-colors duration-500`}
    >
      {/* 1. Branding Section */}
      <div
        className={`p-6 border-b ${themeBorderClass} flex items-center gap-3 mb-6`}
      >
        <div
          className={`p-2 rounded-lg ${isIndigo ? "bg-indigo-500/10" : "bg-emerald-500/10"}`}
        >
          <Cpu size={20} className={themeColorClass} />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase italic">
          DevOps <span className={themeColorClass}>Pilot</span>
        </span>
      </div>

      {/* 2. Global Module Switcher (The Slide Toggle) */}
      <ModuleSwitcher />

      {/* 3. Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Core Fleet
        </div>
        <SidebarLink
          to="/dashboard"
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
          mode={mode}
        />
        <SidebarLink
          to="/monitor"
          label="Live Monitor"
          icon={<Activity size={18} />}
          mode={mode}
        />
        <SidebarLink
          to="/pipeline-history"
          label="Build History"
          icon={<History size={18} />}
          mode={mode}
        />

        <div className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          AI Engine
        </div>
        <SidebarLink
          to="/analysis/new"
          label="New Analysis"
          icon={<Search size={18} />}
          mode={mode}
        />
        <SidebarLink
          to="/history"
          label="Analysis Archive"
          icon={<ScrollText size={18} />}
          mode={mode}
        />

        <div className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Orchestration
        </div>
        <SidebarLink
          to="/orchestration"
          label="Ops Command"
          icon={<Layers size={18} />}
          mode={mode}
        />
      </nav>

      {/* 4. Real-time Status Indicator */}
      {status === "PROCESSING" && (
        <div
          className={`mt-auto p-4 mx-4 mb-4 rounded-2xl border transition-all duration-500 ${
            isIndigo
              ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400"
              : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <div className="flex items-center text-[11px] font-black uppercase tracking-tight">
            <span className="relative flex h-2 w-2 mr-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isIndigo ? "bg-indigo-400" : "bg-emerald-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isIndigo ? "bg-indigo-500" : "bg-emerald-500"
                }`}
              ></span>
            </span>
            Neural Analysis Active
          </div>
        </div>
      )}
    </aside>
  );
}

function SidebarLink({
  to,
  label,
  icon,
  mode,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  mode: "INTELLIGENCE" | "OPERATIONS";
}) {
  const isIndigo = mode === "INTELLIGENCE";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-xl font-bold text-xs transition-all duration-300 group ${
          isActive
            ? isIndigo
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
              : "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
        }`
      }
    >
      <span className="mr-3 transition-transform group-hover:scale-110">
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
    </NavLink>
  );
}
