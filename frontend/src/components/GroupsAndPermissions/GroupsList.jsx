import React, {useEffect, useState} from 'react';
import {fetchGroups, deleteGroup} from '../../api/groups.js';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip,
    Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate, useLocation} from 'react-router-dom';

export default function GroupsList() {
    const [groups, setGroups] = useState([]);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Зареждане на групите
    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await fetchGroups();
                setGroups(data);
            } catch (err) {
                console.error(err);
                setSnackbar({open: true, message: 'Failed to load groups', severity: 'error'});
            }
        };
        loadGroups();
    }, []);
    useEffect(() => {
        const state = location.state;

        if (state?.message) {
            setSnackbar({
                open: true,
                message: state.message,
                severity: state.severity || 'success',
            });

// чистим state без да trigger-ваме нов navigation loop
            window.history.replaceState({}, document.title);

        }
    }, []);

    const handleOpenConfirm = (group) => {
        setGroupToDelete(group);
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setGroupToDelete(null);
    };

    const handleDelete = async () => {
        if (!groupToDelete) return;
        try {
            await deleteGroup(groupToDelete.id);
            setSnackbar({open: true, message: 'Group deleted successfully', severity: 'success'});
            setGroups(prev => prev.filter(g => g.id !== groupToDelete.id));
        } catch (err) {
            console.error(err);
            setSnackbar({open: true, message: 'Failed to delete group', severity: 'error'});
        } finally {
            handleCloseConfirm();
        }
    };

    return (
        <>
            <Box
                sx={{
                    maxWidth: 1000,
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
                    <Button variant="contained" onClick={() => navigate('/groups/create')}>
                        Create Group
                    </Button>
                </Box>

                <TableContainer component={Paper} sx={{boxShadow: 'none'}}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{bgcolor: 'grey.100'}}>
                                <TableCell align="center"><strong>Name</strong></TableCell>
                                <TableCell align="center"><strong>Permissions</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groups.map(group => (
                                <TableRow key={group.id} hover>
                                    <TableCell align="center">{group.name}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {group.permissions_display.map((perm) => (
                                                <Chip
                                                    key={perm}
                                                    label={perm}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{mb: 0.5}}
                                                />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => navigate(`/groups/edit/${group.id}`)}>
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleOpenConfirm(group)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Confirm Dialog */}
            <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the group "{groupToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MUI Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
