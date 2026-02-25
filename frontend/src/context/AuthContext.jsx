import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, silent = false) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (!silent) toast.success('Login successful!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            await api.post('/auth/register', { name, email, password, role });
            toast.success('Registration successful! Please check your email to verify.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = (silent = false) => {
        setUser(null);
        localStorage.removeItem('userInfo');
        if (!silent) toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
