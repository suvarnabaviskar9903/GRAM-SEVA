import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] text-slate-900">
          <div className="max-w-md w-full rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h1 className="text-lg font-bold text-red-700">Gram Seva — View Error</h1>
            <p className="text-sm text-slate-600">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
            >
              Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  AdminCategoriesPage,
  AdminCitizensPage,
  AdminDepartmentsPage,
  AdminFeedbackPage,
  AdminSettingsPage,
  AdminStaffPage,
} from './pages/AdminManagementPages';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { VillageMapPage } from './pages/VillageMapPage';
import type { UserRole } from './types';

function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const home =
      user.role === 'admin'
        ? '/admin'
        : user.role === 'staff'
        ? '/staff'
        : '/citizen';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <ErrorBoundary>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    fontSize: '13px',
                    borderRadius: '10px',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/track" element={<TrackComplaintPage />} />
                <Route path="/map" element={<VillageMapPage />} />

                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Citizen Routes */}
                <Route
                  path="/citizen"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <CitizenDashboard mode="overview" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/complaints"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <CitizenDashboard mode="list" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/submit"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <SubmitComplaintPage />
                    </ProtectedRoute>
                  }
                />

                {/* Staff Routes */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffDashboard mode="overview" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/tasks"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffDashboard mode="tasks" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/completed"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffDashboard mode="completed" />
                    </ProtectedRoute>
                  }
                />

                {/* Gram Panchayat Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard mode="overview" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/complaints"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard mode="complaints" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/staff"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminStaffPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/citizens"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminCitizensPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/departments"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDepartmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminCategoriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/feedback"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminFeedbackPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminSettingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            </ErrorBoundary>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
