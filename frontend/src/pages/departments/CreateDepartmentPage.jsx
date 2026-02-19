import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DepartmentForm from '../../components/departments/DepartmentForm';
import { createDepartment } from '../../api/departments';

export default function CreateDepartmentPage() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    const res = await createDepartment(data);
    navigate('/departments', {
      state: { message: `Department "${res.name}" created successfully`, severity: 'success' },
    });
  };

  return (
    <Box sx={{ p: 0 }}>
      <DepartmentForm onSubmit={handleCreate} />
    </Box>
  );
}
