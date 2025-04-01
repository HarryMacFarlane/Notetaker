import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null); 

export function AuthProvider({ children }) {
    
    // Load token and timestamp from session storage
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [timestamp, setTimestamp] = useState(() => {
        const storedTimestamp = sessionStorage.getItem("timestamp");
        return storedTimestamp ? parseInt(storedTimestamp, 10) : null;
    });

    // Function to initialize authentication (store token + timestamp)
    const refreshToken = (newToken) => {
        setToken(newToken);
        const now = Date.now();
        setTimestamp(now);
        
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("timestamp", now.toString());
    };

    // Logout function (clears token + session storage)
    const logout = async () => {
        try {
            await fetch("/logout", { method: "POST", credentials: "include" });
        }
        catch (error) {
            console.error("Could not fully log out:", error);
        }
        setToken(null);
        setTimestamp(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("timestamp");
        alert("Logged out successfully!");
        window.location.href = "/";
    };

    const getToken = () => {
    }

    // Function to refresh token if expired
    const refreshAuthToken = async () => {
        try {
            const response = await fetch("/refresh", { method: "POST", credentials: "include" });
            if (response.ok) {
                const data = await response.json();
                initializeAuth(data.token);
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            logout();
            return false;
        }
    };

    // Check authentication status on mount
    useEffect(() => {
        if (!token || !timestamp) return;

        const now = Date.now();

        if (now - timestamp >= ONE_HOUR) {
            console.log("Token expired. Attempting refresh...");
            refreshAuthToken();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, refreshToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}
