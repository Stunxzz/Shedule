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
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
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
            await api.post("register/", {
                email,
                first_name: firstName,
                last_name: lastName,
                password,
                password2,
            });
            setSuccess("Registration successful. You can login now.");
            setEmail("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setPassword2("");
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                const messages = Object.keys(data).map((field) => {
                    return data[field].join(" ");
                });
                setError(messages.join(" | "));
            } else {
                setError("Registration failed. Check input or email already exists.");
            }
        }
    };

    return (
        <Container
            maxWidth="sm" sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",

            // 👇 ключовото тук
            alignItems: {xs: "flex-start", md: "center"},

            // малко padding за мобилни
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
                                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
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
                                        <IconButton onClick={() => setShowPassword2((prev) => !prev)} edge="end">
                                            {showPassword2 ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button type="submit" variant="contained" fullWidth sx={{py: 1.5}}>
                            Register
                        </Button>

                        <Stack direction="row" justifyContent="center" spacing={1}>
                            <Typography variant="body2" alignSelf="center">Already have an account?</Typography>
                            <Button component={Link} to="/login" size="small">
                                Login
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
