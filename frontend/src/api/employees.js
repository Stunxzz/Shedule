import api from './axios';

// Взимаме всички служители
export const fetchEmployees = async () => {
    try {
        const res = await api.get('/employees/');
        return res.data;
    } catch (err) {
        console.error('Error fetching employees', err);
        throw err;
    }
};

export const fetchEmployee = async (id) => {
    try {
        const res = await api.get(`/employees/${id}/`);
        return res.data;
    } catch (err) {
        console.error(`Error fetching employee ${id}`, err);
        throw err;
    }
};

export const createEmployee = async (data) => {
    try {
        const res = await api.post('/employees/', data);
        return res.data;
    } catch (err) {
        console.error('Error creating employee', err);
        throw err;
    }
};

export const updateEmployee = async (id, data) => {
    try {
        const res = await api.put(`/employees/${id}/`, data);
        return res.data;
    } catch (err) {
        console.error(`Error updating employee ${id}`, err);
        throw err;
    }
};

export const deleteEmployee = async (id) => {
    try {
        const res = await api.delete(`/employees/${id}/`);
        return res.data;
    } catch (err) {
        console.error(`Error deleting employee ${id}`, err);
        throw err;
    }
};

export const importEmployees = async () => {
    try {
        const res = await api.post('/employees/import/');
        return res.data;
    } catch (err) {
        console.error('Error importing employees', err);
        throw err;
    }
};

export const clearEmployees = async () => {
    try {
        const res = await api.post('/employees/clear/');
        return res.data;
    } catch (err) {
        console.error('Error clearing employees', err);
        throw err;
    }
};