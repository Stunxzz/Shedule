import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Alert } from "@mui/material";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("profile/");
        setProfile(res.data);
      } catch (err) {
        setError("Failed to fetch profile.");
        console.error("Profile error:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" mb={2}>Profile</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {profile ? (
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Email:</strong> {profile.email}</Typography>
            <Typography><strong>First Name:</strong> {profile.first_name}</Typography>
            <Typography><strong>Last Name:</strong> {profile.last_name}</Typography>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
        <Button variant="contained" sx={{ mt: 4 }} onClick={logout}>Logout</Button>
      </Box>
    </Container>
  );
}
