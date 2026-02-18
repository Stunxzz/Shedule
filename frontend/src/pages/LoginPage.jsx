import {useState} from "react";
import {Container, Box, Typography, TextField, Button, Alert} from "@mui/material";
import {useAuth} from "../context/useAuth";

export default function LoginPage() {
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed. Check credentials.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 8, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h4" mb={2}>Login</Typography>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{width: "100%"}}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{mt: 2}}>Login</Button>
                </Box>
            </Box>
        </Container>
    );
}
