import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { JudgeDashboardPage } from "@/pages/JudgeDashboardPage";

function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function AppRoutes({ isAdmin, isJudge, onAdminLogin, onJudgeLogin, onLogout }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage onAdminLogin={onAdminLogin} onJudgeLogin={onJudgeLogin} />}
      />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute isAuthenticated={isAdmin}>
            <AdminDashboardPage onLogout={onLogout} />
          </PrivateRoute>
        }
      />
      <Route
        path="/judge/*"
        element={
          <PrivateRoute isAuthenticated={isJudge}>
            <JudgeDashboardPage judge={isJudge} onLogout={onLogout} />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJudge, setIsJudge] = useState(null);

  function handleAdminLogin() {
    setIsAdmin(true);
  }

  function handleJudgeLogin(judge) {
    setIsJudge(judge);
  }

  function handleLogout() {
    setIsAdmin(false);
    setIsJudge(null);
  }

  return (
    <BrowserRouter>
      <AppRoutes
        isAdmin={isAdmin}
        isJudge={isJudge}
        onAdminLogin={handleAdminLogin}
        onJudgeLogin={handleJudgeLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

