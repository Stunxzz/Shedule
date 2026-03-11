import {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Grid,
    Chip
} from "@mui/material";
import {Visibility, Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios.js";
import {useAuth} from "../../context/useAuth.jsx";

export default function DepartmentListPage() {

    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(() => {
        const fetchDepartments = async () => {
            const res = await api.get("/departments/all/");
            setDepartments(res.data);
        };
        fetchDepartments();
    }, []);

    const handleCreate = (deptId) => {
        const currentWeek = new Date().getWeekNumber();
        navigate(`/schedules/create/${deptId}/${currentWeek}`);
    };

    const handleView = async (deptId) => {
        const res = await api.get(`/last-schedule/?department=${deptId}`);

        if (!res.data.week) {
            alert("No schedule exists for this department yet");
            return;
        }

        navigate(`/schedules/view/${deptId}/${res.data.week}`);
    };

    const isForeman = user?.groups?.includes("Foreman");

    const canCreate = (deptName) => {
        return isForeman && user?.department === deptName;
    };

    return (
        <Box m={2}>

            <Typography
                variant="h4"
                fontWeight={600}
                mb={3}
                textAlign="center"
            >
                Schedules
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2} ml={2}>
                Select a department to view or create a weekly schedule
            </Typography>
            <Box
                sx={{
                    m: 2,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)"
                    }
                }}
            >
                {departments.map((d) => {
                    const isUserDept = user?.department === d.name;

                    return (
                        <Card
                            key={d.id}
                            sx={{
                                height: 160,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                p: 2,
                                transition: "0.25s",
                                border: isUserDept ? "2px solid #1976d2" : "1px solid #eee",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 6
                                }
                            }}
                        >
                            <Typography variant="h6" fontWeight={600}>
                                {d.name}
                            </Typography>

                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleView(d.id)}
                                >
                                    View
                                </Button>

                                {canCreate(d.name) && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleCreate(d.id)}
                                    >
                                        Create
                                    </Button>
                                )}
                            </Stack>
                        </Card>
                    );
                })}
            </Box>
        </Box>
    );
}


/* ISO week helper */
Date.prototype.getWeekNumber = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
};