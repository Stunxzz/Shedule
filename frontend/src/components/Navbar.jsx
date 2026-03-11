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
    {label: "Schedules", path: "/schedules"},
    {label: "Employees", path: "/employees"},
    {label: "Profile", path: "/profile"},
    {label: "Groups", path: "/groups"},
    {label: "Departments", path: "/departments"},
];

const gradient = "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {user, loading} = useAuth();

    if (loading) return null;

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const filteredNav = navItems.filter((item) => {
        if (item.path === "/groups") {
            return user?.is_superuser || user?.groups?.includes("Admin");
        }
        if (item.path === "/users") {
            return user?.is_superuser || user?.groups?.includes("Admin");
        }
        return true;
    });

    const drawer = (
        <Box
            sx={{
                width: 260,
                height: "100%",
                background: "linear-gradient(180deg, #0f2027, #203a43)",
                color: "white",
                pt: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    textAlign: "center",
                    fontWeight: 700,
                    background: gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                }}
            >
                My SaaS App
            </Typography>

            <Divider sx={{borderColor: "rgba(255,255,255,0.1)"}}/>

            <List sx={{mt: 2}}>
                {filteredNav.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItemButton
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            sx={{
                                mx: 2,
                                my: 0.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                transition: "0.3s",
                                color: isActive ? "white" : "rgba(255,255,255,0.8)",
                                background: isActive ? gradient : "transparent",
                                "&:hover": {
                                    background: isActive
                                        ? gradient
                                        : "rgba(255,255,255,0.08)",
                                },
                            }}
                        >
                            {item.label}
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backdropFilter: "blur(16px)",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        minHeight: 70,
                        px: {xs: 2, md: 4},
                    }}
                >
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        onClick={() => navigate("/")}
                        sx={{
                            fontWeight: 800,
                            cursor: "pointer",
                            background: gradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: 0.5,
                        }}
                    >
                        My SaaS App
                    </Typography>

                    {/* Desktop Nav */}
                    <Box sx={{display: {xs: "none", md: "flex"}, gap: 1}}>
                        {filteredNav.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <Button
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        position: "relative",
                                        px: 3,
                                        py: 1,
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        color: isActive ? "white" : "text.primary",
                                        background: isActive ? gradient : "transparent",
                                        transition: "0.3s",

                                        "&:hover": {
                                            background: isActive
                                                ? gradient
                                                : "rgba(0,0,0,0.05)",
                                        },

                                        "&::after": !isActive && {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 6,
                                            left: "50%",
                                            width: 0,
                                            height: 2,
                                            background: gradient,
                                            transition: "0.3s",
                                            transform: "translateX(-50%)",
                                        },

                                        "&:hover::after": !isActive && {
                                            width: "60%",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* Mobile Icon */}
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            display: {md: "none"},
                            color: "#203a43",
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
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