import {createTheme} from "@mui/material/styles";

const theme = createTheme({
    shape: {
        borderRadius: 12,
    },

    typography: {
        fontFamily: "Inter, Roboto, sans-serif",
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background:
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    minHeight: "100vh",
                },
            },
        },


        MuiCard: {
            styleOverrides: {
                root: {
                    backdropFilter: "blur(14px)",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    borderRadius: 16,
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                size: "small",
            },
        },

        MuiButton: {
            defaultProps: {
                fullWidth: true,
                variant: "contained",
            },
            styleOverrides: {
                root: {
                    padding: "10px 0",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 10,
                    "@media (max-width:600px)": {
                        padding: "8px 0",
                        fontSize: "0.85rem",
                    },
                },
            },
        },

        MuiLink: {
            styleOverrides: {
                root: {
                    cursor: "pointer",
                    fontWeight: 500,
                },
            },
        },


    },
});

export default theme;
