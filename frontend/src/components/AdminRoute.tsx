import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="container py-5">Carregando...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;