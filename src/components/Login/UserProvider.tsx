import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {BASE_API_URL} from "../../utils/constants.tsx";

// Define User interface based on the shape of your user data
interface User {
    name: string;
    email: string;
    id: string | undefined;  
    credits: number;
    subscription: string | undefined;
}

// Define the context type with userData and setUserData functions
interface UserContextType {
    userData: User | null;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}


// Create a context to store user data
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use UserContext
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export const UserProvider =  ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    // Store JWT in localStorage for persistence
                    localStorage.setItem("access_token", token);

                    // Fetch user data
                    const response = await fetch(`${BASE_API_URL}/users/info`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setUserData(data.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // Check for token in localStorage (for page reloads)
                console.log("Login - check stored access_token");
                const storedToken = localStorage.getItem("access_token");
                if (storedToken) {
                    try {
                        // Fetch user data with the stored token
                        const response = await fetch(`${BASE_API_URL}/users/info`, {
                            headers: {
                                Authorization: `Bearer ${storedToken}`
                            }
                        });
                        const data = await response.json();
                        setUserData(data);
                    } catch (error) {
                        console.error("Error fetching stored user data:", error);
                        localStorage.removeItem("access_token"); // Clean up if token fails
                    }
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, getAccessTokenSilently, user]);


    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
