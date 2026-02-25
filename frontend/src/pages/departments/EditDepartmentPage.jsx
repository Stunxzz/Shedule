import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import DepartmentForm from "../../components/Departments/DepartmentForm.jsx";
import api from "../../api/axios.js";
import {CircularProgress, Box} from "@mui/material";
import {useSnackbar} from "../../context/snackbar-context";

const EditDepartmentPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const {showSnackbar} = useSnackbar();

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

    const handleUpdate = async (data) => {
        try {
            await api.put(`/departments/${id}/`, data);
            showSnackbar("Department updated successfully!", "success");
            setTimeout(() => navigate("/departments"), 800);
        } catch (err) {
            showSnackbar(err.response?.data?.name?.[0] || "Failed to update department", "error");
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    return <DepartmentForm initialData={department} onSubmit={handleUpdate}/>;
};

export default EditDepartmentPage;
