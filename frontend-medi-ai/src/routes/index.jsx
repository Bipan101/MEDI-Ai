import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import RoleSelectionPage from '../pages/auth/RoleSelectionPage.jsx';

// User Pages
import UserDashboard from '../pages/user/UserDashboard.jsx';
import ScanInterpreter from '../pages/user/ScanInterpreter.jsx';
import MedicineScanner from '../pages/user/MedicineScanner.jsx';
import HistoryPage from '../pages/user/HistoryPage.jsx';
import HealthProviders from '../pages/user/HealthProviders.jsx';
import AppointmentPage from '../pages/user/AppointmentPage.jsx';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx';
import PatientRequests from '../pages/doctor/PatientRequests.jsx';
import PatientAppointmentRequests from '../pages/doctor/PatientAppointmentRequests.jsx';
import ActivePatientList from '../pages/doctor/ActivePatientList.jsx';
import AppointmentsScheduling from '../pages/doctor/AppointmentsScheduling.jsx';

// Shared Pages
import ProfilePage from '../pages/shared/ProfilePage.jsx';
import SettingsPage from '../pages/shared/SettingsPage.jsx';
import NotFoundPage from '../pages/shared/NotFoundPage.jsx';

// Layout Components
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace /> : <LoginPage />
        } />
        <Route path="/signup" element={
          user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace /> : <SignupPage />
        } />
        <Route path="/role-selection" element={
          user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace /> : <RoleSelectionPage />
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* User Routes */}
          <Route index element={
            user?.role === 'doctor' ? 
              <Navigate to="/doctor/dashboard" replace /> : 
              <Navigate to="/dashboard" replace />
          } />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="scan-interpreter" element={
            <ProtectedRoute allowedRoles={['user']}>
              <ScanInterpreter />
            </ProtectedRoute>
          } />
          <Route path="medicine-scanner" element={
            <ProtectedRoute allowedRoles={['user']}>
              <MedicineScanner />
            </ProtectedRoute>
          } />
          <Route path="history" element={
            <ProtectedRoute allowedRoles={['user']}>
              <HistoryPage />
            </ProtectedRoute>
          } />
          <Route path="health-providers" element={
            <ProtectedRoute allowedRoles={['user']}>
              <HealthProviders />
            </ProtectedRoute>
          } />
          <Route path="appointments" element={
            <ProtectedRoute allowedRoles={['user']}>
              <AppointmentPage />
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="doctor/appointment-requests" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientAppointmentRequests />
            </ProtectedRoute>
          } />
          <Route path="doctor/active-patients" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <ActivePatientList />
            </ProtectedRoute>
          } />
          <Route path="doctor/appointments" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AppointmentsScheduling />
            </ProtectedRoute>
          } />
          <Route path="doctor/patient-requests" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientRequests />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;