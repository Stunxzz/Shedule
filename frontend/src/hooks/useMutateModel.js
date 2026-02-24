import { useState } from "react";
import api from "../api/axios";

/**
 * Generic hook for CRUD operations for a model endpoint
 * @param {string} endpoint - e.g. "users/"
 */
export const useMutateModel = (endpoint) => {
  const [loading, setLoading] = useState(false);

  const createItem = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(endpoint, data);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, data) => {
    setLoading(true);
    try {
      // формируем clean payload без id
      const payload = { ...data };
      if ("id" in payload) delete payload.id;

      const res = await api.put(`${endpoint}${id}/`, payload);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await api.delete(`${endpoint}${id}/`);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createItem, updateItem, deleteItem, loading };
};