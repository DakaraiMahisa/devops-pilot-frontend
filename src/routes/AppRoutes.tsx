// routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnalysisLayout } from "../layouts/AnalysisLayout";
import { AnalysisProvider } from "../features/analysis/context";
// Import your page components
import Dashboard from "../pages/DashboardPage";
import NewAnalysis from "../pages/NewAnalysisPage";
import History from "../pages/HistoryPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          <Route element={<AnalysisLayout />}>
            {/* Default redirect to Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis/new" element={<NewAnalysis />} />
            <Route path="history" element={<History />} />

            {/* Catch-all for 404s */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  );
}
