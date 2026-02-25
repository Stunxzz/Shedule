import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "./DeleteDialog";
import api from "../../api/axios.js";
import { useSnackbar } from "../../context/snackbar-context"; // <- добавяме контекста

const HeaderActions = ({
    row,
    endpoint,
    refetch,
    showView = true,
}) => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar(); // <- hook за показване на Snackbar
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    return (
        <>
            {showView && (
                <IconButton onClick={() => alert(JSON.stringify(row, null, 2))}>
                    <VisibilityIcon />
                </IconButton>
            )}

            <IconButton onClick={() => navigate(`/${endpoint}/edit/${row.id}`)}>
                <EditIcon />
            </IconButton>

            <Tooltip title="Delete">
                <IconButton
                    onClick={() => setDeleteOpen(true)}
                    sx={{
                        color: "error.main",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            backgroundColor: "error.light",
                            color: "white",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <DeleteDialog
                open={deleteOpen}
                onClose={() => !deleting && setDeleteOpen(false)}
                onConfirm={async () => {
                    try {
                        setDeleting(true);
                        await api.delete(`/${endpoint}/${row.id}/`);
                        refetch();
                        setDeleteOpen(false);
                        showSnackbar(
                            `${row.name || row.email} deleted successfully!`,
                            "success"
                        );
                    } catch (err) {
                        console.error(err);
                        showSnackbar("Failed to delete item.", "error");
                    } finally {
                        setDeleting(false);
                    }
                }}
                title={`Delete ${row.name || row.email}?`}
                description="This action cannot be undone."
                maxWidth="sm"
                fullWidth
            />
        </>
    );
};

export default HeaderActions;