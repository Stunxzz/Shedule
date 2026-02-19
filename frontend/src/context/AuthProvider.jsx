import {createContext, useState, useEffect} from "react";
import api, {setAccessToken} from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Silent login при refresh
    useEffect(() => {
        const initUser = async () => {
            try {
                // опитай да вземеш profile с текущ access token или refresh token
                const res = await api.get("me/");
                setUser(res.data);
            } catch (err) {
                setUser(null);
                console.error("Silent login failed:", err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };
        initUser();
    }, []);

    // Login функция
    const login = async (email, password) => {
        try {
            // 1️⃣ POST /token/
            const response = await api.post("token/", {email, password});
            setAccessToken(response.data.access);

            // 2️⃣ Fetch profile
            const profileRes = await api.get("profile/");
            setUser(profileRes.data);

            // 3️⃣ Redirect към /profile
            window.location.href = "/profile";
        } catch (err) {
            console.error("Login failed:", err.response ? err.response.data : err.message);
            throw err; // LoginPage ще покаже грешка
        }
    };

    // Logout
    const logout = () => {
        setAccessToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};
