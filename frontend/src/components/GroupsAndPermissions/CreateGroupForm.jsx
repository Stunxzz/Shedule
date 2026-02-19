import React, {useEffect, useState} from 'react';
import {fetchPermissions} from '../../api/permissions';
import {createGroup} from '../../api/groups.js';
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';

export default function CreateGroupForm() {
    const [groupName, setGroupName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' // 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const loadPermissions = async () => {
            try {
                const perms = await fetchPermissions();
                setPermissions(perms);
            } catch (err) {
                console.error(err);
                setSnackbar({
                    open: true,
                    message: 'Failed to load permissions',
                    severity: 'error'
                });
            }
        };
        loadPermissions();
    }, []);

    const handleToggle = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createGroup({name: groupName, permissions: selectedPermissions});
            setSnackbar({
                open: true,
                message: 'Group created successfully!',
                severity: 'success'
            });
            setGroupName('');
            setSelectedPermissions([]);
        } catch (err) {
            console.error(err);
            // Ако backend връща валидни грешки в response.data
            const errorMessage =
                err.response?.data?.name?.[0] ||
                err.response?.data?.permissions?.[0] ||
                'Error creating group';
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <Typography variant="h6" sx={{mb: 2}}>
                    Create New Group
                </Typography>

                <TextField
                    label="Group Name"
                    fullWidth
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    margin="normal"
                />

                <Typography variant="subtitle1" sx={{mt: 2}}>
                    Assign Permissions
                </Typography>

                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {permissions.map(p => (
                        <Box key={p.id} sx={{width: {xs: '48%', sm: '30%'}}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.includes(p.id)}
                                        onChange={() => handleToggle(p.id)}
                                    />
                                }
                                label={`${p.name}`}
                            />
                        </Box>
                    ))}
                </Box>


                <Button type="submit" variant="contained" fullWidth sx={{mt: 3}}>
                    Create Group
                </Button>
            </Box>

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
