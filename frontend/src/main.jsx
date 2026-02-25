import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import {AuthProvider} from "./context/useAuth";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./theme";
import SnackbarProvider from "./providers/SnackbarProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <SnackbarProvider>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <AppRouter/>
                </ThemeProvider>
            </AuthProvider>
        </SnackbarProvider>
    </React.StrictMode>
);

