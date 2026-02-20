import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Box,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";

import { fetchUser, updateUser } from "../../api/user.js";
import { fetchDepartments } from "../../api/departments.js";
import { fetchGroups } from "../../api/groups.js";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const getData = async () => {
      try {
        const [user, deps, grs] = await Promise.all([
          fetchUser(id),
          fetchDepartments(),
          fetchGroups(),
        ]);

        // map user data to match backend expectation
        setUserData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          department_id: user.department ? user.department.id : null,
          groups_ids: user.groups ? user.groups.map((g) => g.id) : [],
        });

        setDepartments(deps);
        setGroups(grs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (_, value) => {
    setUserData({ ...userData, department_id: value ? value.id : null });
  };

  const handleGroupsChange = (_, values) => {
    setUserData({ ...userData, groups_ids: values.map((v) => v.id) });
  };

  const handleSubmit = async () => {
    try {
      await updateUser(id, userData);
      setSnackbar({ open: true, message: "User updated successfully!", severity: "success" });

      // Redirect after short delay
      setTimeout(() => navigate("/users", { state: { message: "User updated successfully!" } }), 1000);
    } catch (err) {
      console.error("Error updating user:", err);
      setSnackbar({ open: true, message: "Failed to update user!", severity: "error" });
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Card sx={{ maxWidth: 600, margin: "40px auto", p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Edit User
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="first_name"
              value={userData.first_name || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={userData.last_name || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              name="email"
              value={userData.email || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            {/* Department single select */}
            <Autocomplete
              options={departments}
              getOptionLabel={(option) => option.name}
              value={departments.find((d) => d.id === userData.department_id) || null}
              onChange={handleDepartmentChange}
              renderInput={(params) => <TextField {...params} label="Department" size="small" />}
            />

            {/* Groups multi-select */}
            <Autocomplete
              multiple
              options={groups}
              getOptionLabel={(option) => option.name}
              value={groups.filter((g) => userData.groups_ids.includes(g.id))}
              onChange={handleGroupsChange}
              renderInput={(params) => <TextField {...params} label="Groups" size="small" />}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate("/users")}>
                Cancel
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit}>
                Save
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserEdit;