import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { SetupPage } from './pages/SetupPage';
import { InterviewPage } from './pages/InterviewPage';
import { BriefPage } from './pages/BriefPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClinicianDashboard } from './pages/ClinicianDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { Spinner } from './components/shared/Spinner';

function RootRedirect() {
  const { appUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!appUser) return <Navigate to="/login" replace />;
  if (appUser.role === 'clinician') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/patient-dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Smart root redirect based on role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Clinician-only: patient scenario selector */}
      <Route path="/intake" element={<ProtectedRoute requiredRole="clinician"><SetupPage /></ProtectedRoute>} />

      {/* Shared interview + brief */}
      <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
      <Route path="/brief" element={<ProtectedRoute><BriefPage /></ProtectedRoute>} />

      {/* Clinician dashboard */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute requiredRole="clinician"><ClinicianDashboard /></ProtectedRoute>}
      />

      {/* Patient dashboard */}
      <Route
        path="/patient-dashboard"
        element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
