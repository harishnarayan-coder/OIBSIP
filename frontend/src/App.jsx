import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import PizzaBuilder from './pages/PizzaBuilder';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import BackButton from './components/BackButton';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <BackButton />
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/admin-login" element={<AuthPage isAdmin={true} />} />
            <Route path="/admin-register" element={<AuthPage isAdmin={true} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute userOnly={true} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/build" element={<PizzaBuilder />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
