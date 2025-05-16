import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'employee' | 'manager';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { user, isLoading, path: location.pathname }); // Debug log

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('No user found, redirecting to login'); // Debug log
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log('User role mismatch:', { required: requiredRole, actual: user.role }); // Debug log
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
} 