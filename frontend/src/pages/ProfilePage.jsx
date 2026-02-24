import {useState} from "react";
import {
    Container,
    Card,
    Typography,
    Button,
    Stack,
    Avatar,
    TextField,
    Chip,
    Snackbar,
    Alert,
    Box,
    Divider,
    Paper,
} from "@mui/material";
import {useAuth} from "../context/useAuth";
import {updateCurrentUser} from "../api/user";

export default function ProfilePage() {
    const {user: currentUser, logout} = useAuth();
    const [profile, setProfile] = useState({...currentUser, avatarFile: null});
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const avatarUrl = profile.avatarFile
        ? URL.createObjectURL(profile.avatarFile)
        : profile.avatar
            ? `${backendUrl}${profile.avatar}`
            : "/default-avatar.png";

    const handleAvatarChange = (e) => {
        if (e.target.files?.[0]) {
            setProfile((prev) => ({...prev, avatarFile: e.target.files[0]}));
        }
    };

    const handleChange = (field, value) => {
        setProfile((prev) => ({...prev, [field]: value}));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            ["first_name", "last_name"].forEach((f) =>
                formData.append(f, profile[f])
            );
            if (profile.avatarFile) formData.append("avatar", profile.avatarFile);

            await updateCurrentUser(formData);

            setSnackbar({
                open: true,
                message: "Profile updated successfully",
                severity: "success",
            });

            if (profile.avatarFile) {
                setProfile((prev) => ({
                    ...prev,
                    avatar: URL.createObjectURL(prev.avatarFile),
                    avatarFile: null,
                }));
            }
        } catch (err) {
            console.error(err)
            setSnackbar({
                open: true,
                message: "Something went wrong",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
                py: {xs: 4, md: 8},
            }}
        >
            <Container maxWidth="md">
                <Card
                    sx={{
                        p: {xs: 3, md: 5},
                        borderRadius: 4,
                        backdropFilter: "blur(20px)",
                        background: "rgba(255,255,255,0.95)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                        position: "relative",
                        overflow: "visible",
                    }}
                >
                    {/* Floating Avatar */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -70,
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                            }}
                        >
                            <Avatar
                                src={avatarUrl}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: "4px solid white",
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    <Stack spacing={4} mt={8}>
                        {/* Name Section */}
                        <Box textAlign="center">
                            <Typography variant="h4" fontWeight={700}>
                                {profile.first_name} {profile.last_name}
                            </Typography>

                            <Chip
                                label={profile.department || "No Department"}
                                sx={{
                                    mt: 2,
                                    px: 2,
                                    fontWeight: 600,
                                    background:
                                        "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                                    color: "white",
                                }}
                            />
                        </Box>

                        <Divider/>

                        {/* Editable Fields */}
                        <Stack spacing={3}>
                            <Stack direction={{xs: "column", md: "row"}} spacing={3}>
                                <TextField
                                    label="First Name"
                                    value={profile.first_name || ""}
                                    onChange={(e) =>
                                        handleChange("first_name", e.target.value)
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Last Name"
                                    value={profile.last_name || ""}
                                    onChange={(e) =>
                                        handleChange("last_name", e.target.value)
                                    }
                                    fullWidth
                                />
                            </Stack>

                            <TextField
                                label="Email"
                                value={profile.email || ""}
                                fullWidth
                                disabled
                            />

                            {/* Groups */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    mb={1}
                                >
                                    Access Groups
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {profile.groups?.map((g, idx) => (
                                        <Chip
                                            key={idx}
                                            label={g}
                                            variant="outlined"
                                            sx={{fontWeight: 500}}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Actions */}
                        <Stack
                            direction={{xs: "column", md: "row"}}
                            spacing={2}
                            mt={2}
                        >
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSave}
                                disabled={saving}
                                sx={{
                                    py: 1.4,
                                    fontWeight: 600,
                                    background:
                                        "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                }}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                color="error"
                                onClick={logout}
                                sx={{py: 1.4, fontWeight: 600}}
                            >
                                Logout
                            </Button>
                        </Stack>

                        {/* Upload Button */}
                        <Button
                            component="label"
                            variant="text"
                            sx={{alignSelf: "center", fontWeight: 500}}
                        >
                            Change Profile Picture
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                    </Stack>
                </Card>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((prev) => ({...prev, open: false}))
                }
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}