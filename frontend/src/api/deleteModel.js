// frontend/src/api/deleteModel.js
import api from "./axios";

/**
 * Delete a model item by endpoint and id
 * @param {string} endpoint - например "users", "groups", "departments"
 * @param {number|string} id - id на елемента
 * @returns {Promise<any>}
 */
export const deleteModel = async (endpoint, id) => {
  try {
    const res = await api.delete(`/${endpoint}/${id}/`);
    return res.data;
  } catch (err) {
    console.error(`Failed to delete ${endpoint} id=${id}`, err);
    throw err;
  }
};