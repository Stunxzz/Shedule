import React from "react";
import {Button, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useFetchModel} from "../../hooks/useFetchModel.js";
import {GenericTable} from "../../components/Generic/GenericTable.jsx";
import HeaderActions from "../../components/Generic/HeaderActions.jsx";

const EmployeesPage = () => {
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
    } = useFetchModel("employees/");

    const columns = [
        {field: "personal_number", label: "Personal Number"},
        {field: "first_name", label: "First Name"},
        {field: "last_name", label: "Last Name"},
        {field: "department_detail.name", label: "Department", render: (row) => row.department_detail?.name || "-"},
        {field: "route_detail.name", label: "Route", render: (row) => row.route_detail?.name || "-"},
        {
            field: "actions",
            label: "Actions",
            render: (row) => (
                <HeaderActions
                    row={row}
                    endpoint="employees"
                    refetch={refetch}
                    showView={false}
                    successMessage="Employee deleted successfully!"
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
                    onClick={() => navigate("/employee/create")}
                >
                    Create Employee
                </Button>
            }
        />
    );
};

export default EmployeesPage;