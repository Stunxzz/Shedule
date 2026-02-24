// frontend/src/pages/DepartmentsPage.jsx
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetchModel } from "../../hooks/useFetchModel.js";
import { GenericTable } from "../../components/Generic/GenericTable.jsx";
import HeaderActions from "../../components/Generic/HeaderActions.jsx";

const DepartmentsPage = () => {
  const navigate = useNavigate();

  const {
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    search,
    setSearch,
    loading,
    refetch,
  } = useFetchModel("departments/");

  const columns = [
    { field: "name", label: "Department Name" },
    { field: "description", label: "Description" },
    {
      field: "actions",
      label: "Actions",
      render: (row) => (
        <HeaderActions
          row={row}
          endpoint="departments"
          refetch={refetch}
          showView={false} // hide view icon
          successMessage="Department deleted successfully!"
        />
      ),
    },
  ];

  return (
    <GenericTable
      columns={columns}
      data={data}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      total={total}
      search={search}
      setSearch={setSearch}
      loading={loading}
      headerActions={
        <Button
          variant="contained"
          onClick={() => navigate("/departments/create")}
        >
          Create Department
        </Button>
      }
    />
  );
};

export default DepartmentsPage;