import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

const DeleteDialog = ({open, onClose, onConfirm, title, description}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="error" variant="contained" onClick={onConfirm}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteDialog;