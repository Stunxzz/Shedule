import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";

import { fetchUser } from "../../api/user.js";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser(id);
        setUser(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  if (!user)
    return (
      <Typography align="center" mt={4}>
        User not found
      </Typography>
    );

  return (
    <Card sx={{ maxWidth: 700, margin: "40px auto", p: 3, borderRadius: 3, boxShadow: 3 }}>
      {/* Header with Avatar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
        <Avatar
          src={user.avatar} // взимаме avatar от backend
          sx={{ width: 100, height: 100, boxShadow: 3 }}
        />
        <Box flex={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Department and Groups */}
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 100 }}>
            Department:
          </Typography>
          <Typography variant="body1">{user.department?.name || "—"}</Typography>
        </Stack>

        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Groups:
          </Typography>
          <Paper variant="outlined" sx={{ p: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {user.groups?.length ? (
              user.groups.map((g) => (
                <Chip
                  key={g.id}
                  label={`${g.name}`}
                  size="small"
                  color="info"
                />
              ))
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Paper>
        </Stack>
      </Stack>

      <Box mt={4}>
        <Chip
          label="Back to Users"
          onClick={() => navigate("/users")}
          clickable
          color="secondary"
        />
      </Box>
    </Card>
  );
};

export default UserProfile;