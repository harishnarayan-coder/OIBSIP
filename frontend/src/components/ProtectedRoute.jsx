import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false, userOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        if (adminOnly) {
            return <Navigate to="/admin-login" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    if (userOnly && user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
