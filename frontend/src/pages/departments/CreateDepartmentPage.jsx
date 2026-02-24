// frontend/src/pages/CreateDepartmentPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import DepartmentForm from "../../components/Departments/DepartmentForm.jsx";
import api from "../../api/axios.js";

const CreateDepartmentPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (data, setSnackbar) => {
    try {
      await api.post("/departments/", data);
      setSnackbar({
        open: true,
        message: "Department created successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/departments"), 800);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.name?.[0] || "Failed to create department",
        severity: "error",
      });
    }
  };

  return <DepartmentForm onSubmit={handleCreate} />;
};

export default CreateDepartmentPage;
