"use client";

import {createContext, ReactNode, useContext, useState } from "react";

// Define shape of user object
interface User {
    name: string;
    email: string;
    role: string;
    organization: string;
}

// Define the shape of context value
interface UserContextType {
    user: User | null;
    loginUser: (userData: User) => void;
    logoutUser: () => void;
}

// Mock user data for demonstration
const mockUser: User = {
    name: "Finhelper User",
    email: "user@finhelper.com",
    role: "User",
    organization: "Finhelper, Inc.",
};

// User Context with a default value
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: {children:ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    const loginUser = (userData: User) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    const value = {user, loginUser, logoutUser};

    return (
        <UserContext.Provider value={value}> 
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};