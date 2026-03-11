// frontend/src/pages/employee/EmployeeCreatePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import EmployeeForm from '../../components/employee/EmployeeForm';
import api from '../../api/axios';
import { useSnackbar } from '../../context/snackbar-context.js';

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleCreate = async (data) => {
    try {
      await api.post('/employees/', data);
      showSnackbar('Employee created successfully!', 'success');

      // Малка пауза преди навигация, за да се види Snackbar
      setTimeout(() => navigate('/employees'), 800);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.personal_number?.[0] ||
        err.response?.data?.first_name?.[0] ||
        err.response?.data?.last_name?.[0] ||
        'Failed to create employee';
      showSnackbar(msg, 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>

      <EmployeeForm onSubmit={handleCreate} />
    </Box>
  );
}