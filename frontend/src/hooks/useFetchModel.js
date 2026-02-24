import { useState, useEffect } from "react";
import api from "../api/axios";

export const useFetchModel = (endpoint) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint, {
        params: { page, search },
      });
      setData(res.data.results);
      setTotal(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  return {
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    search,
    setSearch,
    loading,
    refetch: fetchData,
  };
};