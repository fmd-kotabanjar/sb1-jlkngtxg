import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { initializeMockData } from './data/mockData';
import { initializeDigitalProducts } from './data/digitalProducts';

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
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
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

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    initializeDigitalProducts();
  }, []);

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
                {user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
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

        {/* Claimed prompts only for basic users */}
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

        {/* Redeem code - not for admin */}
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

        {/* Upgrade only for non-premium users */}
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
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;