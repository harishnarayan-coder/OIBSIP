import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const AuthPage = ({ isAdmin = false }) => {
    const { login, register, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine initial state based on route
    const [isFlipped, setIsFlipped] = useState(location.pathname.includes('register'));

    useEffect(() => {
        setIsFlipped(location.pathname.includes('register'));
    }, [location]);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            // First, login silently (no immediate success toast)
            const data = await login(loginEmail, loginPassword, true);

            // Now enforce role routing and show the appropriate single toast
            if (isAdmin && data.role !== 'admin') {
                logout(true); // Silent logout
                toast.error("Users must log in via the User Portal.");
            } else if (!isAdmin && data.role === 'admin') {
                logout(true); // Silent logout
                toast.error("Admins must log in via the Admin Portal.");
            } else {
                toast.success(isAdmin ? "Welcome back, Admin!" : "Welcome back to PizzaVerse!");
                navigate(isAdmin ? '/admin' : '/dashboard');
            }
        } catch (error) {
            console.error('Login error', error);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(regName, regEmail, regPassword, isAdmin ? 'admin' : 'user');
            // Show toast, tell them to verify email
            setIsFlipped(false); // Flip back to login
            navigate(isAdmin ? '/admin-login' : '/login', { replace: true });
        } catch (error) {
            console.error('Registration error', error);
        }
    };

    return (
        <div className="auth-container" style={{ background: 'var(--bg-color)', position: 'relative' }}>
            <Link to="/" className="btn-outline" style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 20px', borderRadius: '8px', borderWidth: '2px', background: 'var(--bg-color)' }}>
                &larr; Back Home
            </Link>
            <div className="flip-container">
                <div className={`flipper ${isFlipped ? 'flipped' : ''}`}>

                    {/* FRONT: LOGIN */}
                    <div className="front">
                        <div className="auth-card" style={{ height: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem' }}>{isAdmin ? '🛡️' : '🍕'}</div>
                            <h2>{isAdmin ? 'Admin Portal' : 'Welcome Back'}</h2>
                            <p className="auth-subtitle">{isAdmin ? 'Login to manage PizzaVerse operations.' : 'Login to track your delicious custom pizzas.'}</p>
                            <form onSubmit={handleLoginSubmit} className="auth-form">
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Log In</button>
                            </form>
                            <div className="auth-links">
                                <Link to="/forgot-password" style={{ color: 'var(--text-muted)' }}>Forgot Password?</Link>
                                <p>Don't have an account? <button type="button" onClick={() => { setIsFlipped(true); navigate(isAdmin ? '/admin-register' : '/register', { replace: true }) }} style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>Sign Up</button></p>
                            </div>
                        </div>
                    </div>

                    {/* BACK: REGISTER */}
                    <div className="back">
                        <div className="auth-card" style={{ height: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem' }}>{isAdmin ? '🔑' : '✨'}</div>
                            <h2>{isAdmin ? 'Admin Registration' : 'Create Account'}</h2>
                            <p className="auth-subtitle">{isAdmin ? 'Request admin access to PizzaVerse.' : 'Join PizzaVerse to start building.'}</p>
                            <form onSubmit={handleRegisterSubmit} className="auth-form">
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="input-group" style={{ marginBottom: '10px' }}>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                        placeholder="Secure password"
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Sign Up</button>
                            </form>
                            <div className="auth-links">
                                <p>Already have an account? <button type="button" onClick={() => { setIsFlipped(false); navigate(isAdmin ? '/admin-login' : '/login', { replace: true }) }} style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>Log In</button></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;
