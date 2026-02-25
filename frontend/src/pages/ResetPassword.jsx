import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
            toast.success(data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>New Password</h2>
                <p className="auth-subtitle">Enter your new password below</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
