import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { keyframes } from "@emotion/react";

// Лека анимация за заглавието
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function ProfilePage() {
  const { logout } = useAuth();
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
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-start", md: "center" },
        py: { xs: 3, md: 0 },
      }}
    >
      <Card sx={{ width: "100%", p: { xs: 2, sm: 4 }, boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${fadeIn} 1s ease-out`,
            }}
          >
            Your Profile
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!profile ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={2} alignItems="center">
              {/* Avatar */}
              <Avatar
                src={profile.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  boxShadow: 3,
                }}
              />

              {/* Profile info */}
              <Stack spacing={1} width="100%">
                <Typography>
                  <strong>Email:</strong> {profile.email}
                </Typography>
                <Typography>
                  <strong>First Name:</strong> {profile.first_name}
                </Typography>
                <Typography>
                  <strong>Last Name:</strong> {profile.last_name}
                </Typography>
              </Stack>

              {/* Logout button */}
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 3 }}
                onClick={logout}
              >
                Logout
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
