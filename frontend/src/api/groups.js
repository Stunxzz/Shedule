import api from './axios';

export const createGroup = async (groupData) => {
    const res = await api.post('/groups/', groupData);
    return res.data;
};

export const addUserToGroup = async (groupId, userId) => {
    const res = await api.post(`/groups/${groupId}/add_user/`, {user: userId});
    return res.data;
};
export const fetchGroups = async () => {
    const res = await api.get('/groups/');
    return res.data;
};

export const deleteGroup = async (id) => {
    const res = await api.delete(`/groups/${id}/`);
    return res.data;
};

export const fetchGroup = async (id) => {
  const res = await api.get(`/groups/${id}/`);
  return res.data;
};

export const updateGroup = async (id, data) => {
  const res = await api.put(`/groups/${id}/`, data);
  return res.data;
};