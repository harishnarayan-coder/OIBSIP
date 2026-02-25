import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default to user, could be exposed for testing
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            // Don't navigate, show toast so user can check email
        } catch (error) {
            console.error('Registration error', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join us for the best custom pizzas!</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Full Name"
                        />
                    </div>
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
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                        />
                    </div>
                    {/* Basic role selection for demonstration testing purposes */}
                    <div className="input-group">
                        <label>Account Type</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign Up</button>
                </form>
                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
