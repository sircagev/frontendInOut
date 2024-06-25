import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../components/config/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogout, setIsLogout] = useState(false)
    const [expire, setExpire] = useState(false)
    const [user, setUser] = useState(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error('Invalid token:', error);
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded);
                }
                else {
                    console.log('Token Expire');
                    setExpire(true);
                    setUser(null)
                    Cookies.remove('token');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setUser(null);
            }
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axiosClient.post('validate/validar', credentials);
            const { token } = response.data;
            Cookies.set('token', token);
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            Cookies.remove('token');
            setUser(null);
            setIsLogout(true)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLogout, setIsLogout, expire, setExpire }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
