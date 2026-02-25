// frontend/src/pages/CreateDepartmentPage.jsx
import React from "react";
import {useNavigate} from "react-router-dom";
import DepartmentForm from "../../components/Departments/DepartmentForm.jsx";
import api from "../../api/axios.js";
import {useSnackbar} from "../../context/snackbar-context";

const CreateDepartmentPage = () => {
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar()

    const handleCreate = async (data) => {
        try {
            await api.post("/departments/", data);
            showSnackbar("Department created successfully!", "success");

            setTimeout(() => navigate("/departments"), 800);
        } catch (err) {
            showSnackbar(err.response?.data?.name?.[0] || "Failed to create department", "error");
        }
    };

    return <DepartmentForm onSubmit={handleCreate}/>;
};

export default CreateDepartmentPage;
