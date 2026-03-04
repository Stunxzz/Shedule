import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Stack,
    CircularProgress
} from '@mui/material';

import { fetchDepartments } from '../../api/departments';
import { fetchRoutes } from '../../api/routes';
import { useSnackbar } from '../../context/snackbar-context.js';

export default function EmployeeForm({ initialData = null, onSubmit }) {
    const [personalNumber, setPersonalNumber] = useState(initialData?.personal_number || '');
    const [firstName, setFirstName] = useState(initialData?.first_name || '');
    const [lastName, setLastName] = useState(initialData?.last_name || '');
    const [departmentId, setDepartmentId] = useState(initialData?.department || '');
    const [routeId, setRouteId] = useState(initialData?.route || '');

    const [departments, setDepartments] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [deps, rts] = await Promise.all([
                    fetchDepartments(),
                    fetchRoutes()
                ]);

                setDepartments(deps.results || []);
                setRoutes(rts.results || []);
            } catch (err) {
                console.error(err);
                showSnackbar('Failed to load departments or routes', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [showSnackbar]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await onSubmit({
                personal_number: personalNumber,
                first_name: firstName,
                last_name: lastName,
                department: departmentId,
                route: routeId,
            });

            showSnackbar(
                initialData
                    ? 'Employee updated successfully!'
                    : 'Employee created successfully!',
                'success'
            );

            if (!initialData) {
                setPersonalNumber('');
                setFirstName('');
                setLastName('');
                setDepartmentId('');
                setRouteId('');
            }
        } catch (err) {
            console.error(err);

            const msg =
                err.response?.data?.personal_number?.[0] ||
                err.response?.data?.first_name?.[0] ||
                err.response?.data?.last_name?.[0] ||
                'Error saving employee';

            showSnackbar(msg, 'error');
        }
    };

    // ✅ Loading guard (като при User page)
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 800,
                mx: 'auto',
                mt: 4,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 4,
            }}
        >
            <Typography variant="h6" sx={{ mb: 3 }}>
                {initialData ? 'Edit Employee' : 'Create New Employee'}
            </Typography>

            <TextField
                label="Personal Number"
                fullWidth
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                margin="normal"
                required
            />

            <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
                required
            />

            <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
                required
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                <TextField
                    select
                    label="Department"
                    fullWidth
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                >
                    {departments?.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                            {dep.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Route"
                    fullWidth
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                >
                    {routes?.map((rt) => (
                        <MenuItem key={rt.id} value={rt.id}>
                            {rt.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <Button
                type="submit"
                fullWidth
                sx={{
                    mt: 4,
                    py: 1.4,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #3f9ae6 0%, #00d4e6 100%)',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                        transform: 'translateY(-2px)',
                    },
                }}
            >
                {initialData ? 'Update Employee' : 'Create Employee'}
            </Button>
        </Box>
    );
}