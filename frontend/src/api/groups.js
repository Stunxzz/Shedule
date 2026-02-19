import api from './axios';

export const createGroup = async (groupData) => {
    const res = await api.post('/groups/', groupData);
    return res.data;
};

export const addUserToGroup = async (groupId, userId) => {
    const res = await api.post(`/groups/${groupId}/add_user/`, {user: userId});
    return res.data;
};
