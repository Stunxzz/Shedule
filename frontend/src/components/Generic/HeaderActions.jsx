import React, { useState } from "react";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "./DeleteDialog";

const HeaderActions = ({
  row,
  endpoint,
  refetch,
  showView = true,
}) => {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      {showView && (
        <IconButton onClick={() => alert(JSON.stringify(row, null, 2))}>
          <VisibilityIcon />
        </IconButton>
      )}

      <IconButton
        onClick={() => navigate(`/${endpoint}/edit/${row.id}`)}
      >
        <EditIcon />
      </IconButton>

      <IconButton onClick={() => setDeleteOpen(true)}>
        <DeleteIcon />
      </IconButton>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await fetch(`${endpoint}/${row.id}/`, {
            method: "DELETE",
          });
          refetch();
          setDeleteOpen(false);
        }}
        title={`Delete ${row.name || row.email}?`}
        description="This action cannot be undone."
      />
    </>
  );
};

export default HeaderActions;