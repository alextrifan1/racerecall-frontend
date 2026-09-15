import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [username, setUsername] = useState(() => localStorage.getItem('username'));

    const login = async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        const { token: jwtToken } = response.data;

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('username', credentials.username);
        setToken(jwtToken);
        setUsername(credentials.username);
    };

    const register = async (credentials) => {
        const response = await api.post('/api/auth/register', credentials);
        const { token: jwtToken } = response.data;

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('username', credentials.username);
        setToken(jwtToken);
        setUsername(credentials.username);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUsername(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider value={{ token, username, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};