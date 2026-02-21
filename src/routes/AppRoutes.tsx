// routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnalysisLayout } from "../layouts/AnalysisLayout";
import { AnalysisProvider } from "../features/analysis/context";

// Import your page components
import Dashboard from "../pages/DashboardPage";
import NewAnalysis from "../pages/NewAnalysisPage";
import History from "../pages/HistoryPage";

/** * NEW: Import the Live Monitor component.
 * Since we used 'export default' in PipelineDashboard.tsx,
 * we import it without curly braces.
 */
import PipelineDashboard from "../features/monitor/PipelineDashboard";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          {/* AnalysisLayout usually contains your Sidebar and Header */}
          <Route element={<AnalysisLayout />}>
            {/* Default redirect to Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />

            {/* NEW: Live Monitor Route 
                Accessed via: http://localhost:5173/monitor
            */}
            <Route path="monitor" element={<PipelineDashboard />} />

            <Route path="analysis/new" element={<NewAnalysis />} />
            <Route path="history" element={<History />} />

            {/* Catch-all for 404s */}
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
