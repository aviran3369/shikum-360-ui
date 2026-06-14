import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, NotificationsProvider, UIProvider, useAuth } from '@/store';
import { AuthLayout, DashboardLayout } from '@/components/layout';
import { LoginPage } from '@/features/auth/LoginPage';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { SchedulingPage } from '@/features/scheduling/SchedulingPage';
import { ReferralsPage } from '@/features/referrals/ReferralsPage';
import { UsersPage } from '@/features/users/UsersPage';
import { ReportsHistoryPage } from '@/features/reports/ReportsHistoryPage';
import { FinancialReportsPage } from '@/features/reports/FinancialReportsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { NotificationsPage } from '@/features/notifications/NotificationsPage';
import { ActivityLogPage } from '@/features/activity/ActivityLogPage';
import { NotFoundPage } from '@/features/misc/NotFoundPage';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <NotificationsProvider>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/scheduling" element={<SchedulingPage />} />
                  <Route path="/referrals" element={<ReferralsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/reports/history" element={<ReportsHistoryPage />} />
                  <Route path="/reports/financial" element={<FinancialReportsPage />} />
                  <Route path="/activity" element={<ActivityLogPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </NotificationsProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
