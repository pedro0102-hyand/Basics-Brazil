import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminRoute = ({ children, allowCustomer = false }: { children: ReactNode; allowCustomer?: boolean }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) return <div className="container py-5">{t('loading')}</div>;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin' && !allowCustomer) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;