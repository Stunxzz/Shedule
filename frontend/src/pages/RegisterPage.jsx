import {useState} from "react";
import {Container, Box, Typography, TextField, Button, Alert} from "@mui/material";
import api from "../api/axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            });
            setSuccess("Registration successful. You can login now.");
            setEmail("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setPassword2("");
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed. Check input or email exists.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 8, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h4" mb={2}>Register</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 2, width: "100%"}}>
                    <TextField label="Email" type="email" fullWidth margin="normal" value={email}
                               onChange={e => setEmail(e.target.value)} required/>
                    <TextField label="First Name" fullWidth margin="normal" value={firstName}
                               onChange={e => setFirstName(e.target.value)} required/>
                    <TextField label="Last Name" fullWidth margin="normal" value={lastName}
                               onChange={e => setLastName(e.target.value)} required/>
                    <TextField label="Password" type="password" fullWidth margin="normal" value={password}
                               onChange={e => setPassword(e.target.value)} required/>
                    <TextField label="Repeat Password" type="password" fullWidth margin="normal" value={password2}
                               onChange={e => setPassword2(e.target.value)} required/>
                    <Button type="submit" variant="contained" fullWidth sx={{mt: 2}}>Register</Button>
                </Box>
            </Box>
        </Container>
    );
}
