import {createContext, useState} from "react";
import api, {setAccessToken} from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const response = await api.post("token/", {email, password});
        setAccessToken(response.data.access);
        setUser({email});
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
