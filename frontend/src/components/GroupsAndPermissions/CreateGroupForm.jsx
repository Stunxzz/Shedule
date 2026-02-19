// frontend/src/components/GroupsAndPermission/GroupForm.jsx
import React, { useEffect, useState } from 'react';
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
import { fetchPermissions } from '../../api/permissions';

export default function CreateGroup({ initialData = null, onSubmit }) {
  const [groupName, setGroupName] = useState(initialData?.name || '');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState(initialData?.permissions || []);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Зареждане на всички permissions
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const perms = await fetchPermissions();
        setPermissions(perms);
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: 'Failed to load permissions', severity: 'error' });
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
      await onSubmit({ name: groupName, permissions: selectedPermissions });
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.name?.[0] ||
        err.response?.data?.permissions?.[0] ||
        'Error saving group';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          {initialData ? 'Edit Group' : 'Create New Group'}
        </Typography>

        <TextField
          label="Group Name"
          fullWidth
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          margin="normal"
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Assign Permissions
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {permissions.map(p => (
            <Box key={p.id} sx={{ width: { xs: '48%', sm: '30%' } }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(p.id)}
                    onChange={() => handleToggle(p.id)}
                  />
                }
                label={p.name}
              />
            </Box>
          ))}
        </Box>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          {initialData ? 'Update Group' : 'Create Group'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
