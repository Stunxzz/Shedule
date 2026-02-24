import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { CircularProgress, Box, Snackbar, Alert } from "@mui/material";
import GroupForm from "../../components/GroupsAndPermissions/CreateGroupForm.jsx";

const EditGroupPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const loadGroup = async () => {
            try {
                const res = await api.get(`/groups/${id}/`);
                setGroup(res.data);
            } catch (err) {
                console.error(err);
                setSnackbar({ open: true, message: "Failed to load group", severity: "error" });
            } finally {
                setLoading(false);
            }
        };

        loadGroup();
    }, [id]);

    const handleUpdate = async (data) => {
        try {
            await api.put(`/groups/${id}/`, data);
            setSnackbar({ open: true, message: "Group updated successfully!", severity: "success" });
            setTimeout(() => navigate("/groups"), 800);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.name?.[0] || "Failed to update group",
                severity: "error",
            });
        }
    };

    if (loading)
        return (
            <Box textAlign="center" mt={4}>
                <CircularProgress />
            </Box>
        );

    return (
        <>
            <GroupForm initialData={group} onSubmit={handleUpdate} />
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

export default EditGroupPage;