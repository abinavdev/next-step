import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <div />;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

export default PublicRoute;
