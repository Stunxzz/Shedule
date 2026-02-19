import React, {useState, useEffect} from 'react';
import {Box, TextField, Button, Snackbar, Alert} from '@mui/material';

export default function DepartmentForm({initialData = null, onSubmit}) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit({name, description});
        } catch (err) {
            setSnackbar({open: true, message: err.message || 'Error', severity: 'error'});
        }
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3
            }}>
                <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal"
                           required/>
                <TextField label="Description" fullWidth value={description}
                           onChange={(e) => setDescription(e.target.value)} margin="normal" multiline rows={3}/>

                <Button type="submit" variant="contained" fullWidth sx={{mt: 3}}>
                    {initialData ? 'Update Department' : 'Create Department'}
                </Button>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={4000}
                      onClose={() => setSnackbar({...snackbar, open: false})}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity}
                       variant="filled" sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
