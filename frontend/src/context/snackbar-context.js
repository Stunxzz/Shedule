import {createContext, useContext} from "react";

export const SnackbarContext = createContext(null);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within SnackbarProvider");
    }
    return context;
};