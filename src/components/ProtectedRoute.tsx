import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isOnboardingComplete, isHydrated } = useUserStore();

  // Wait until auth finished loading and user profile hydration is complete
  if (isLoading || !isHydrated) return <LoadingScreen />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isOnboardingComplete) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
