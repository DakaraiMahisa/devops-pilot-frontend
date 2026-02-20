// features/analysis/components/AnalysisLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../features/analysis/components/Sidebar";

export function AnalysisLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />{" "}
          {/* This is where New Analysis, History, etc., will render */}
        </div>
      </main>
    </div>
  );
}
