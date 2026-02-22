import { Outlet } from "react-router-dom";
import Sidebar from "../features/analysis/components/Sidebar"; // Ensure this path is correct for your project
import { useTheme } from "../features/analysis/context/useTheme";

export function AnalysisLayout() {
  const { mode } = useTheme();

  // Map the global state to CSS variables or classes
  const isIndigo = mode === "INTELLIGENCE";

  return (
    <div
      className={`flex h-screen transition-colors duration-700 ${
        isIndigo ? "bg-slate-950" : "bg-zinc-950"
      }`}
    >
      {/* Sidebar - Now reactive via our previous update */}
      <Sidebar />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 relative">
        {/* THE SECRET SAUCE: Subtle Glow Effects */}
        <div
          className={`absolute top-0 right-0 w-150 h-150 rounded-full blur-[150px] opacity-10 pointer-events-none transition-colors duration-1000 ${
            isIndigo ? "bg-indigo-600" : "bg-emerald-600"
          }`}
        />

        <div
          className={`absolute bottom-0 left-0 w-100 h-100 rounded-full blur-[120px] opacity-5 pointer-events-none transition-colors duration-1000 ${
            isIndigo ? "bg-blue-600" : "bg-teal-600"
          }`}
        />

        {/* Content Wrapper */}
        <div className="max-w-400 mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
