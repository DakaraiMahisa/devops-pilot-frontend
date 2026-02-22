// components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAnalysisContext } from "../context/useAnalysisContext";

export default function Sidebar() {
  const { status } = useAnalysisContext();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        DevOps Pilot
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink to="/dashboard" label="Dashboard" icon="📊" />
        <SidebarLink to="/monitor" label="Live Monitor" icon="🚀" />

        {/* NEW: Link to Build History */}
        <SidebarLink to="/pipeline-history" label="Build History" icon="⏳" />

        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Manual Tools
        </div>

        <SidebarLink to="/analysis/new" label="New Analysis" icon="🔍" />
        <SidebarLink to="/history" label="Analysis Archive" icon="📜" />
      </nav>

      {/* Real-time Status Indicator */}
      {status === "PROCESSING" && (
        <div className="mt-auto p-4 mx-4 mb-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <div className="flex items-center text-blue-400 text-xs font-medium">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI is analyzing logs...
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
}: {
  to: string;
  label: string;
  icon: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`
      }
    >
      <span className="mr-3">{icon}</span> {label}
    </NavLink>
  );
}
