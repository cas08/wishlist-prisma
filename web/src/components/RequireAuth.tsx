import { Navigate, useLocation } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
