import {useState, useCallback} from "react";
import {Snackbar, Alert} from "@mui/material";
import {SnackbarContext} from "../context/snackbar-context.js";

export default function SnackbarProvider({children}) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = useCallback((message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    const handleClose = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    return (
        <SnackbarContext.Provider value={{showSnackbar}}>
            {children}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={handleClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}