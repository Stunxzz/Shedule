import api from './axios';

// Взимаме всички служители
export const fetchRoutes = async () => {
    try {
        const res = await api.get('/routes/');
        return res.data;
    } catch (err) {
        console.error('Error fetching routes', err);
        throw err;
    }
};

export const fetchRoute = async (id) => {
    try {
        const res = await api.get(`/routes/${id}/`);
        return res.data;
    } catch (err) {
        console.error(`Error fetching route ${id}`, err);
        throw err;
    }
};

export const createRoute = async (data) => {
    try {
        const res = await api.post('/routes/', data);
        return res.data;
    } catch (err) {
        console.error('Error creating route', err);
        throw err;
    }
};

export const updateRoute = async (id, data) => {
    try {
        const res = await api.put(`/routes/${id}/`, data);
        return res.data;
    } catch (err) {
        console.error(`Error updating route ${id}`, err);
        throw err;
    }
};

export const deleteRoute = async (id) => {
    try {
        const res = await api.delete(`/routes/${id}/`);
        return res.data;
    } catch (err) {
        console.error(`Error deleting route ${id}`, err);
        throw err;
    }
};

export const fetchAllRoutes = async () => {
  const res = await api.get('/routes/all/');
  return res.data;
};