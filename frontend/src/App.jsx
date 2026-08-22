import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';
import DailyPlanner from './pages/DailyPlanner';
import FocusMode from './pages/FocusMode';
import ProductivityAnalytics from './pages/ProductivityAnalytics';
import Goals from './pages/Goals';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

// Layout
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navbar>{children}</Navbar>;
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginRegister defaultMode="login" />} />
            <Route path="/register" element={<LoginRegister defaultMode="register" />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><TaskManagement /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><DailyPlanner /></ProtectedRoute>} />
            <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><ProductivityAnalytics /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
