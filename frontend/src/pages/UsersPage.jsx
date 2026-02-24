import React from "react";
import {GenericTable} from "../components/Generic/GenericTable";
import {useFetchModel} from "../hooks/useFetchModel";
import HeaderActions from "../components/Generic/HeaderActions";

const UsersPage = () => {
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
        refetch
    } = useFetchModel("users/");

    const columns = [
        {field: "email", label: "Email"},
        {field: "first_name", label: "First Name"},
        {field: "last_name", label: "Last Name"},
        {field: "department", label: "Department", render: (row) => row.department?.name || "-"},
        {field: "groups", label: "Groups", render: (row) => row.groups.map((g) => g.name).join(", ")},
        {
            field: "actions",
            label: "Actions",
            render: (row) => <HeaderActions row={row} endpoint="users" refetch={refetch}/>
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
        />
    );
};

export default UsersPage;