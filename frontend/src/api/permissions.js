import api from './axios';

export const fetchPermissions = async () => {
  const res = await api.get('/permissions/');
  return res.data;
};
