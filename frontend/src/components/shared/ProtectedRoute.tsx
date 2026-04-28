import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './Spinner';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'clinician' | 'patient';
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!appUser) return <Navigate to="/login" replace />;
  if (requiredRole && appUser.role !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}
