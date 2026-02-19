
import api from "./axios";

export const fetchCurrentUser = async () => {
  const res = await api.get("/me/");
  return res.data;
};
