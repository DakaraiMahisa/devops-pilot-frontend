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

// New Imports for Auth & Security
import { LandingPage } from "../features/landing/LandingPage";
import { RegisterPage } from "../features/auth/RegistrationPage";
import { LoginPage } from "../features/auth/LoginPage";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnalysisProvider>
          <Routes>
            {/* --- PUBLIC AREA (No Sidebar, No Layout) --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* --- SECURE PILOT SECTOR --- */}
            {/* The ProtectedRoute acts as the gatekeeper for everything below */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AnalysisLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="monitor" element={<PipelineDashboard />} />
                <Route path="pipeline-history" element={<BuildHistory />} />
                <Route path="analysis/new" element={<NewAnalysis />} />
                <Route path="history" element={<History />} />
                <Route path="orchestration" element={<OrchestrationHub />} />

                {/* Internal 404 within the dashboard layout */}
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-white font-black uppercase tracking-widest opacity-50">
                      System Error: Resource Not Found in Current Sector
                    </div>
                  }
                />
              </Route>
            </Route>

            {/* Global Redirect: If the user hits an unknown public URL, send to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnalysisProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
