import {useState} from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    InputAdornment,
    IconButton,
    Stack,
    FormHelperText,
    Avatar,
} from "@mui/material";
import {Visibility, VisibilityOff, UploadFile} from "@mui/icons-material";
import api from "../api/axios";
import {keyframes} from "@emotion/react";
import {Link} from "react-router-dom";

// Анимация за заглавие
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

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== password2) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("password", password);
            formData.append("password2", password2);
            if (avatar) formData.append("avatar", avatar);

            await api.post("register/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess("Registration successful. You can login now.");
            setEmail("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setPassword2("");
            setAvatar(null);
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                const messages = Object.keys(data).map(field => data[field].join(" "));
                setError(messages.join(" | "));
            } else {
                setError("Registration failed. Check input or email already exists.");
            }
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: {xs: "flex-start", md: "center"},
                py: {xs: 3, md: 0},
            }}
        >
            <Card sx={{width: "100%", p: {xs: 2, sm: 4}, boxShadow: 6, borderRadius: 3}}>
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
                        Create your account
                    </Typography>

                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

                    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="First Name"
                            fullWidth
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Repeat Password"
                            type={showPassword2 ? "text" : "password"}
                            fullWidth
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword2((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword2 ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                src={avatar ? URL.createObjectURL(avatar) : ""}
                                sx={{width: 46, height: 46}}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFile />}
                            >
                                Upload Avatar
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => setAvatar(e.target.files[0])}
                                />
                            </Button>
                        </Stack>
                        <FormHelperText>Optional</FormHelperText>

                        <Button type="submit" variant="contained">
                            Register
                        </Button>

                        <Stack direction="row" justifyContent="center" spacing={1}>
                            {/*<Typography variant="body2" alignSelf="center">Already have an account?</Typography>*/}
                            <Button component={Link} to="/login">
                                Login
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
