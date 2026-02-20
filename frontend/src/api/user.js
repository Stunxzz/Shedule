import api from "./axios";

export const fetchCurrentUser = async () => {
    const res = await api.get("/me/");
    return res.data;
};

export const fetchUsers = async () => {
    const res = await api.get("/users");
    return res.data;
}

export const fetchUser = async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
};

// Актуализиране на user
export const updateUser = async (id, data) => {
    const res = await api.put(`/users/${id}/`, data);
    return res.data;
};

// Изтриване на user
export const deleteUser = async (id) => {
    const res = await api.delete(`/users/${id}/`);
    return res.data;
};