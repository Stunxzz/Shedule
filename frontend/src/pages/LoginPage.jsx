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
    Link,
    Checkbox,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useAuth} from "../context/useAuth";
import {keyframes} from "@emotion/react";
import {Link as RouterLink} from "react-router-dom";

const fadeIn = keyframes`  from {
                               opacity: 0;
                               transform: translateY(-20px);
                           }
                               to {
                                   opacity: 1;
                                   transform: translateY(0);
                               }`;

export default function LoginPage() {
    const {login} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);


        try {
            await login(email, password, remember);
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed.");
        } finally {
            setLoading(false);
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
            <Card
                sx={{
                    width: "100%",
                    maxHeight: "95vh",
                    overflowY: "auto",
                }}
            > <CardContent>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        mb: 3,
                        fontWeight: "bold",
                        background:
                            "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: `${fadeIn} 1s ease-out`,
                    }}
                >
                    Welcome to Shedule </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOff/>
                                        ) : (
                                            <Visibility/>
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={remember}
                                onChange={(e) =>
                                    setRemember(e.target.checked)
                                }
                            />
                        }
                        label="Remember me"
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <CircularProgress size={22}/>
                        ) : (
                            "Login"
                        )}
                    </Button>

                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Link
                            component={RouterLink}
                            to="/register"
                            underline="hover"
                            variant="body2"
                        >
                            Don't have an account?
                        </Link>

                        <Link
                            component={RouterLink}
                            to="/forgot-password"
                            underline="hover"
                            variant="body2"
                        >
                            Forgot password?
                        </Link>
                    </Stack>
                </Stack>
            </CardContent>
            </Card>
        </Container>


    );
}
