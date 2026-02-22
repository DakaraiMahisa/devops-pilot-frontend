import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnalysisLayout } from "../layouts/AnalysisLayout";
import { AnalysisProvider } from "../features/analysis/context";
import { ThemeProvider } from "../features/analysis/context/ThemeProvider";

import Dashboard from "../pages/DashboardPage";
import NewAnalysis from "../pages/NewAnalysisPage";
import History from "../pages/HistoryPage";
import BuildHistory from "../features/analysis/components/History";
import PipelineDashboard from "../features/monitor/PipelineDashboard";
import OrchestrationHub from "../features/orchestration/OrchestrationHub";

export function AppRoutes() {
  return (
    <BrowserRouter>
      {/* Wrap everything in ThemeProvider so Sidebar, ResultPanel, 
        and Hubs can all share the Intelligence/Operations state. 
      */}
      <ThemeProvider>
        <AnalysisProvider>
          <Routes>
            <Route element={<AnalysisLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="monitor" element={<PipelineDashboard />} />

              {/* Pipeline/Build History */}
              <Route path="pipeline-history" element={<BuildHistory />} />

              <Route path="analysis/new" element={<NewAnalysis />} />
              <Route path="history" element={<History />} />

              {/* NEW: The Emerald World Route */}
              <Route path="orchestration" element={<OrchestrationHub />} />

              <Route
                path="*"
                element={<div className="p-8 text-white">Page Not Found</div>}
              />
            </Route>
          </Routes>
        </AnalysisProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
