import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import GroupForm from "../../components/GroupsAndPermissions/CreateGroupForm.jsx";
import { Snackbar, Alert } from "@mui/material";

const CreateGroupPage = () => {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleCreate = async (data) => {
        try {
            await api.post("/groups/", data);
            setSnackbar({ open: true, message: "Group created successfully!", severity: "success" });

            setTimeout(() => navigate("/groups"), 800);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.name?.[0] || "Failed to create group",
                severity: "error",
            });
        }
    };

    return (
        <>
            <GroupForm onSubmit={handleCreate} />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateGroupPage;