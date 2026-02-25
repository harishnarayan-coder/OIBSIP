import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/forgotpassword', { email });
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending email');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Reset Password</h2>
                <p className="auth-subtitle">Enter your email to receive a reset link</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email Address"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Send Link</button>
                </form>
                <div className="auth-links">
                    <p>Remembered your password? <Link to="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
