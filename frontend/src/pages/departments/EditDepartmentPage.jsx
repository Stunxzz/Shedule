// frontend/src/pages/EditDepartmentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DepartmentForm from "../../components/Departments/DepartmentForm.jsx";
import api from "../../api/axios.js";
import { CircularProgress, Box } from "@mui/material";

const EditDepartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const res = await api.get(`/departments/${id}/`);
        setDepartment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [id]);

  const handleUpdate = async (data, setSnackbar) => {
    try {
      await api.put(`/departments/${id}/`, data);
      setSnackbar({
        open: true,
        message: "Department updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/departments"), 800);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.name?.[0] || "Failed to update department",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return <DepartmentForm initialData={department} onSubmit={handleUpdate} />;
};

export default EditDepartmentPage;