// routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnalysisLayout } from "../layouts/AnalysisLayout";
import { AnalysisProvider } from "../features/analysis/context";

import Dashboard from "../pages/DashboardPage";
import NewAnalysis from "../pages/NewAnalysisPage";
import History from "../pages/HistoryPage"; // This is your existing Log History
import BuildHistory from "../features/analysis/components/History"; // Our NEW Build History
import PipelineDashboard from "../features/monitor/PipelineDashboard";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          <Route element={<AnalysisLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="monitor" element={<PipelineDashboard />} />

            {/* NEW: Route for Pipeline/Build History */}
            <Route path="pipeline-history" element={<BuildHistory />} />

            <Route path="analysis/new" element={<NewAnalysis />} />
            <Route path="history" element={<History />} />

            <Route
              path="*"
              element={<div className="p-8 text-white">Page Not Found</div>}
            />
          </Route>
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  );
}
