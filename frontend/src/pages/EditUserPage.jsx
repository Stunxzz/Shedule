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
} from "@mui/material";

import { fetchUser, updateUser } from "../api/user.js";
import { fetchDepartments } from "../api/departments.js";
import { fetchGroups } from "../api/groups.js";
import { useSnackbar } from "../context/snackbar-context.js";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar(); // глобален snackbar

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department_id: null,
    groups_ids: [],
    is_active: true,
    is_staff: false,
  });

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, deps, grs] = await Promise.all([
          fetchUser(id),
          fetchDepartments(),
          fetchGroups(),
        ]);

        setUserData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          department_id: user.department_id || (user.department?.id || null),
          groups_ids: user.groups_ids || user.groups.map((g) => g.id),
          is_active: user.is_active,
          is_staff: user.is_staff,
        });

        setDepartments(deps.results);
        setGroups(grs.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (_, value) => {
    setUserData({ ...userData, department_id: value ? value.id : null });
  };

  const handleGroupsChange = (_, values) => {
    setUserData({ ...userData, groups_ids: values.map((g) => g.id) });
  };

  const handleSubmit = async () => {
    try {
      await updateUser(id, userData);
      showSnackbar("User updated successfully!", "success");
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update user!", "error");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Card sx={{ maxWidth: 600, margin: "40px auto", p: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Edit User
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="First Name"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Department select */}
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
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background:  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                "&:hover": {
                  background:  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                },
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EditUserPage;