import { createContext, useState, useContext, useEffect } from "react";
import { ReAuthModal } from "./Components/ReAuthModal"

export const AuthContext = createContext(null); 

export function AuthProvider({ children }) {

    // Load token and timestamp from session storage
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [timestamp, setTimestamp] = useState(() => {
        const storedTimestamp = sessionStorage.getItem("timestamp");
        return storedTimestamp ? parseInt(storedTimestamp, 10) : null;
    });

    const reAuthenticate = (email, password) => {
        try {
            fetch(
                "/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        'email': email,
                        'password': password
                    }),
                    credentials: 'include'
                }
            ).then(
                (response) => {
                    if (response.ok) {
                        response.json().then(
                            (data) => {
                                sessionStorage.setItem('access_token', data.accessToken);
                                sessionStorage.setItem('timestamp', data.timestamp);
                                return true;
                            }
                        )
                    }
                    else {
                        return false;
                    }
                })
        }
        catch (error) {
            console.log("Error during reAuthenticate: %d", error);
        }
    }

    // Function to initialize authentication (store token + timestamp)
    const refreshToken = (newToken, timestamp) => {
        setToken(newToken);
        setTimestamp(timestamp);
        
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("timestamp", timestamp);
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
        window.location.href = "/";
    };

    const getToken = async () => {
        const now = Date.now();
        if (now <= timestamp){
            return token;
        }
        else {
            const isTokenRefreshed = refreshAuthToken();
            if (isTokenRefreshed) {
                return token;
            }
            else {
                return false;
            }
        }
    }

    // Function to refresh token if expired
    const refreshAuthToken = async () => {
        try {
            fetch("/refresh", 
                { 
                    method: "POST", 
                    credentials: "include" 
                })
                .then(
                    (response) => {
                        if (response.ok) {
                            return true;
                        }
                    }
                )
                .then(
                    (data) => {

                    }
                )
            if (response.ok) {
                const data = await response.json();
                initializeAuth(data.token);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ getToken }}>
            {children}
            <ReAuthModal authFunction={reAuthenticate}/>
        </AuthContext.Provider>
    );
}
