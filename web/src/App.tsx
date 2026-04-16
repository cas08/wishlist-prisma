import { AppShell } from '@mantine/core';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { RequireAuth } from '@/components/RequireAuth';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WishlistPage } from '@/pages/WishlistPage';
function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ) : (
    <HomePage />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell header={{ height: 60 }} padding="md">
          <TopBar />
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/wishlist/:id" element={<WishlistPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  );
}
