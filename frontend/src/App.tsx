import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterCustomerPage } from './pages/RegisterCustomerPage';
import { RegisterWorkerPage } from './pages/RegisterWorkerPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ServiceBookingPage } from './pages/ServiceBookingPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';

// Protected Route Component for Role Guards
const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to home if role unauthorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/customer" element={<RegisterCustomerPage />} />
          <Route path="/register/worker" element={<RegisterWorkerPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ServiceBookingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Worker Routes */}
          <Route
            path="/worker"
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/worker-profile/:id" element={<WorkerProfilePage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
