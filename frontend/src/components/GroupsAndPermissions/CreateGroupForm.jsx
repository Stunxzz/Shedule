// frontend/src/components/GroupsAndPermission/GroupForm.jsx
import React, {useEffect, useState} from 'react';
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Snackbar,
    Alert,
    Stack,
} from '@mui/material';
import {fetchPermissions} from '../../api/permissions';

export default function GroupForm({initialData = null, onSubmit}) {
    const [groupName, setGroupName] = useState(initialData?.name || '');
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(initialData?.permissions || []);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const [loadingPermissions, setLoadingPermissions] = useState(true);

    // Зареждане на permissions
    useEffect(() => {
        const loadPermissions = async () => {
            try {
                const perms = await fetchPermissions();
                setPermissions(perms);
            } catch (err) {
                console.error(err);
                setSnackbar({open: true, message: 'Failed to load permissions', severity: 'error'});
            } finally {
                setLoadingPermissions(false);
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
            await onSubmit({name: groupName, permissions: selectedPermissions});

            setSnackbar({
                open: true,
                message: initialData ? 'Group updated successfully!' : 'Group created successfully!',
                severity: 'success',
            });

            // Ако е нова група, изчистваме формата
            if (!initialData) {
                setGroupName('');
                setSelectedPermissions([]);
            }
        } catch (err) {
            console.error(err);
            const errorMessage =
                err.response?.data?.name?.[0] ||
                err.response?.data?.permissions?.[0] ||
                'Error saving group';

            setSnackbar({open: true, message: errorMessage, severity: 'error'});
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 4,
                }}
            >
                <Typography variant="h6" sx={{mb: 3}}>
                    {initialData ? 'Edit Group' : 'Create New Group'}
                </Typography>

                <TextField
                    label="Group Name"
                    fullWidth
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    margin="normal"
                />

                <Typography variant="subtitle1" sx={{mt: 3, mb: 1}}>
                    Assign Permissions
                </Typography>

                {loadingPermissions ? (
                    <Typography variant="body2" color="text.secondary">
                        Loading permissions...
                    </Typography>
                ) : (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {permissions.map(p => (
                            <FormControlLabel
                                key={p.id}
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.includes(p.id)}
                                        onChange={() => handleToggle(p.id)}
                                    />
                                }
                                label={p.name}
                                sx={{width: {xs: '48%', sm: '30%'}}}
                            />
                        ))}
                    </Stack>
                )}

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
                    {initialData ? "Update Group" : "Create Group"}
                </Button>
            </Box>

            {/* Snackbar */}
            <Snackbar
                key={snackbar.message} // уникален key, за да се рендерира при всяка промяна
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