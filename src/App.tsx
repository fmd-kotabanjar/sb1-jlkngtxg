import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { isSupabaseConfigured } from './lib/supabase';
import SupabaseSetup from './components/Setup/SupabaseSetup';

// Layout
import Header from './components/Layout/Header';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ClaimedPrompts from './pages/ClaimedPrompts';
import RedeemCode from './pages/RedeemCode';
import RequestPrompt from './pages/RequestPrompt';
import Profile from './pages/Profile';
import Upgrade from './pages/Upgrade';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPrompts from './pages/admin/AdminPrompts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminDigitalProducts from './pages/admin/AdminDigitalProducts';
import ConfirmationPage from './pages/ConfirmationPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  // Check if user has admin role in user_roles table or is admin in profile
  return user && (profile?.subscription_tier === 'admin') ? <>{children}</> : <Navigate to="/" />;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>{children}</main>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register />} 
        />
        
        {/* Confirmation page (public) */}
        <Route 
          path="/xonfpro" 
          element={<ConfirmationPage />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <Layout>
                <Explore />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/claimed" 
          element={
            <ProtectedRoute>
              <Layout>
                <ClaimedPrompts />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/redeem" 
          element={
            <ProtectedRoute>
              <Layout>
                <RedeemCode />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/request" 
          element={
            <ProtectedRoute>
              <Layout>
                <RequestPrompt />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/upgrade" 
          element={
            <ProtectedRoute>
              <Layout>
                <Upgrade />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/prompts" 
          element={
            <AdminRoute>
              <Layout>
                <AdminPrompts />
              </Layout>
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <Layout>
                <AdminUsers />
              </Layout>
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/requests" 
          element={
            <AdminRoute>
              <Layout>
                <AdminRequests />
              </Layout>
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/digital-products" 
          element={
            <AdminRoute>
              <Layout>
                <AdminDigitalProducts />
              </Layout>
            </AdminRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  const [showSetup, setShowSetup] = useState(false);
  const [setupChecked, setSetupChecked] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured();
    setShowSetup(!configured);
    setSetupChecked(true);
  }, []);

  if (!setupChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking configuration...</p>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <ThemeProvider>
        <SupabaseSetup onComplete={() => setShowSetup(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;