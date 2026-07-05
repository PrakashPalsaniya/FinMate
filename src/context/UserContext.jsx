/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasBootstrappedAuth = useRef(false);

    const updateUser = (userData) => {
        setUser(userData?.user ?? userData ?? null);
    }

    const clearUser = () => {
        setUser(null);
    }

    const login = (userData) => {
        setUser(userData);
        setLoading(false);
    }

    const logout = async () => {
        setLoading(true);
        try {
            await axiosInstance.post(API_PATH.AUTH.LOGOUT);
        } catch (err) {
            // ignore network errors — still clear local state
            console.error('Logout request failed:', err?.message || err);
        } finally {
            setUser(null);
            setLoading(false);
        }
    }

    const bootstrapAuth = useCallback(async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get(API_PATH.AUTH.GET_USER_INFO);
            setUser(response.data?.user ?? null);
            return Boolean(response.data?.user);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasBootstrappedAuth.current) {
            return;
        }

        hasBootstrappedAuth.current = true;
        bootstrapAuth();
    }, [bootstrapAuth]);

    const isAuthenticated = Boolean(user);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                updateUser,
                clearUser,
                login,
                logout,
                bootstrapAuth,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;
