import React, { useEffect, useState } from 'react';
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
  DialogActions
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';

import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDepartments, deleteDepartment } from '../../api/departments';
import { useAuth } from '../../context/useAuth.jsx';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  // admin = superuser или в група Admin
  const isAdmin =
    user.is_superuser || user.groups?.includes('Admin');

  // ================================
  // Load departments
  // ================================
  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? 'You do not have permission to view departments.'
          : 'Failed to load departments';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // ================================
  // Catch messages from create/edit
  // ================================
  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity || 'success'
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // ================================
  // Delete logic
  // ================================
  const handleDeleteConfirm = (dept) => {
    setDeptToDelete(dept);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(deptToDelete.id);
      setDepartments((prev) =>
        prev.filter((d) => d.id !== deptToDelete.id)
      );
      setSnackbar({
        open: true,
        message: `Department "${deptToDelete.name}" deleted successfully`,
        severity: 'success'
      });
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? 'You do not have permission to delete this department.'
          : 'Failed to delete department';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setConfirmOpen(false);
      setDeptToDelete(null);
    }
  };

  // ================================
  // Render
  // ================================
  return (
    <>
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          mt: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        {/* Create button */}
        {isAdmin && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/departments/create')}
            >
              Create Department
            </Button>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell align="center"><strong>Name</strong></TableCell>
                <TableCell align="center"><strong>Description</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id} hover>
                  <TableCell align="center"><strong>{dept.name}</strong></TableCell>
                  <TableCell align="center">{dept.description}</TableCell>
                  <TableCell align="center">
                    {/* View Members */}
                    <Tooltip title="View Members">
                      <IconButton
                        onClick={() =>
                          navigate(`/departments/${dept.id}/members`)
                        }
                      >
                        <GroupIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Edit & Delete (only for admin) */}
                    {isAdmin && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() =>
                              navigate(`/departments/edit/${dept.id}`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteConfirm(dept)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Confirm delete dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deptToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}