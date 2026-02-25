import React from "react";
import { Button, Chip, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetchModel } from "../../hooks/useFetchModel.js";
import HeaderActions from "../../components/Generic/HeaderActions.jsx";
import { GenericTable } from "../../components/Generic/GenericTable.jsx";

const GroupsPage = () => {
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
  } = useFetchModel("groups/");

  const columns = [
    {
      field: "name",
      label: "Group Name",
    },
    {
      field: "permissions_display",
      label: "Permissions",
      render: (row) => {
        const perms = row.permissions_display || [];

        if (perms.length === 0) return "-";

        const visible = perms.slice(0, 3);
        const remaining = perms.length - visible.length;

        // wrap Stack в div, за да няма div вътре в <p>
        return (
          <Tooltip title={perms.join(", ")} arrow>
            <div>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
              >
                {visible.map((name, index) => (
                  <Chip
                    key={index}
                    label={name.replace("Can ", "")}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}

                {remaining > 0 && (
                  <Chip
                    label={`+${remaining} more`}
                    size="small"
                    color="secondary"
                  />
                )}
              </Stack>
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      label: "Actions",
      render: (row) => (
        <HeaderActions
          row={row}
          endpoint="groups"
          refetch={refetch}
          showView={false}
          successMessage="Group deleted successfully!"
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
          onClick={() => navigate("/groups/create")}
        >
          Create Group
        </Button>
      }
    />
  );
};

export default GroupsPage;