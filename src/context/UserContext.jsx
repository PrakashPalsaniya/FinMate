import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const updateUser = (userData) => {
        setUser(userData);
    }

    const clearUser = () => {
        setUser(null);
    }

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            const fetchUser = async () => {
                try {
                    const response = await axiosInstance.get(API_PATH.AUTH.GET_USER_INFO);
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                    localStorage.removeItem('token');
                }
            };
            fetchUser();
        }
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
                login,
                logout,
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

