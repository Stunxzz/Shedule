// frontend/src/components/Departments/DepartmentForm.jsx
import React, {useState} from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";

const DepartmentForm = ({initialData = null, onSubmit}) => {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(
                {name, description},
                setSnackbar // подаваме setSnackbar, за да може страницата да показва съобщения
            );
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                message: "Failed to save department",
                severity: "error",
            });
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    mt: 4,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" sx={{mb: 2}}>
                    {initialData ? "Edit Department" : "Create Department"}
                </Typography>

                <TextField
                    label="Department Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 4,
                        py: 1.4,
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",

                        "&:hover": {
                            background: "linear-gradient(90deg, #3f9ae6 0%, #00d4e6 100%)",
                            boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
                            transform: "translateY(-2px)",
                        },

                        "&:active": {
                            transform: "translateY(0px)",
                        },
                    }}
                >
                    {initialData ? "Update Department" : "Create Department"}
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DepartmentForm;