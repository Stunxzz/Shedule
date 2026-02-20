import React, {useState} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    Box,
    Button,
    List,
    ListItemButton,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/useAuth";

const navItems = [
    {label: "Users", path: "/users"},
    {label: "Departments", path: "/departments"},
    {label: "Profile", path: "/profile"},
    {label: "Groups", path: "/groups"},
    {label: "Dashboard", path: "/dashboard"},
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {user, loading} = useAuth();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    if (loading) return null; // или loader

    // Филтрираме navItems според user
    const filteredNav = navItems.filter((item) => {
        if (item.path === "/groups") {
            return user?.is_superuser || user?.groups?.includes("Admin");
        }
        return true;
    });

    const drawer = (
        <Box sx={{width: 250, p: 0}} onClick={handleDrawerToggle}>
            <Typography
                variant="h6"
                sx={{my: 2, textAlign: "center", fontWeight: 700}}
            >
                My SaaS App
            </Typography>
            <Divider/>
            <List sx={{m: 0, p: 0}}>
                {filteredNav.map((item) => (
                    <ListItemButton
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        sx={{
                            borderRadius: 1.5,
                            my: 0.5,
                            mx: 0,
                            fontWeight: 600,
                            color:
                                location.pathname === item.path
                                    ? "primary.contrastText"
                                    : "text.primary",
                            backgroundColor:
                                location.pathname === item.path
                                    ? "primary.main"
                                    : "transparent",
                            "&:hover": {
                                backgroundColor:
                                    location.pathname === item.path
                                        ? "primary.dark"
                                        : "rgba(0,0,0,0.05)",
                            },
                        }}
                    >
                        {item.label}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backdropFilter: "blur(12px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    color: "text.primary",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        minHeight: "64px",
                        px: 0,
                    }}
                >
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        sx={{fontWeight: 700, cursor: "pointer", px: 2}}
                        onClick={() => navigate("/")}
                    >
                        My SaaS App
                    </Typography>

                    {/* Desktop buttons */}
                    <Box sx={{display: {xs: "none", sm: "flex"}, gap: 1}}>
                        {filteredNav.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Button
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        color: active ? "primary.contrastText" : "text.primary",
                                        backgroundColor: active ? "primary.main" : "transparent",
                                        "&:hover": {
                                            backgroundColor: active
                                                ? "primary.dark"
                                                : "rgba(0,0,0,0.05)",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* Mobile menu */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{display: {sm: "none"}, p: 1}}
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{keepMounted: true}}
            >
                {drawer}
            </Drawer>
        </>
    );
}
