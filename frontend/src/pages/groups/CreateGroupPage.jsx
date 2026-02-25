import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import GroupForm from "../../components/GroupsAndPermissions/CreateGroupForm.jsx";
import { useSnackbar } from "../../context/snackbar-context"; // само hook

const CreateGroupPage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar(); // ✅ hook вътре в компонент;

    const handleCreate = async (data) => {
        try {
            await api.post("/groups/", data);
            showSnackbar("Group created successfully!", "success");
            setTimeout(() => navigate("/groups"), 800);
        } catch (err) {
            showSnackbar(err.response?.data?.name?.[0] || "Failed to create group", "error");
        }
    };

    return <GroupForm onSubmit={handleCreate} />;
};

export default CreateGroupPage;