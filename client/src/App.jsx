import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BudgetPage from './pages/BudgetPage';
import RenewalsPage from './pages/RenewalsPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      {/* Authenticated Routes wrapped in ProtectedRoute and DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SubscriptionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BudgetPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/renewals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RenewalsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <InsightsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
