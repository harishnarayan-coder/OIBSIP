import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth.css'; // Let's use the primary-btn styling or similar

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show back button on main landing dashboards and checkout (which has its own back button)
    const hiddenPaths = ['/', '/auth', '/dashboard', '/admin', '/login', '/register', '/admin-login', '/admin-register', '/checkout', '/admin/orders'];
    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <button
            onClick={() => {
                if (location.pathname === '/build') {
                    navigate('/dashboard');
                } else {
                    navigate(-1);
                }
            }}
            className="btn-outline"
            style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 20px',
                display: 'inline-flex',
                gap: '8px',
                fontSize: '1rem',
                borderWidth: '2px',
                borderRadius: '8px',
                background: 'var(--bg-color)'
            }}
        >
            <span>&larr;</span> Back
        </button>
    );
};

export default BackButton;
