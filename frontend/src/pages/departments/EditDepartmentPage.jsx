import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DepartmentForm from '../../components/departments/DepartmentForm';
import { fetchDepartment, updateDepartment } from '../../api/departments';

export default function EditDepartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchDepartment(id);
      setDepartment(data);
    };
    load();
  }, [id]);

  const handleUpdate = async (data) => {
    const res = await updateDepartment(id, data);
    navigate('/departments', {
      state: { message: `Department "${res.name}" updated successfully`, severity: 'success' },
    });
  };

  if (!department) return null; // loader optional

  return (
    <Box sx={{ p: 0 }}>
      <DepartmentForm initialData={department} onSubmit={handleUpdate} />
    </Box>
  );
}
