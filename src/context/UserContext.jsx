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



// This code snippet creates a user context in a React application, which provides an easy way to access and update user data anywhere in the app without passing props through every level of the component tree.

// Key Concepts
// React Context
// Context lets you share values (like user data, theme, locale, etc.) between components, avoiding "prop drilling".

// User Context
// This specific context holds logged-in user data and functions to change or clear it.



// Summary of the Code: User Context Provider in React

// Creates a User Context to store information about the currently logged-in user.

// Provides functions to update or clear user data (for example, after login or logout).

// Uses React’s Context API and useState hook for state management.

// Exports a UserProvider component that wraps the children components, making the user data and functions available anywhere inside the app.

// Any component inside this provider can easily access or update the user’s information through the context, without needing to pass props down manually.
