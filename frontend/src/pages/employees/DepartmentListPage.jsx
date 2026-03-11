import {useEffect, useState} from "react";
import {Box, Card, CardContent, Typography, Button, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios.js";

export default function DepartmentListPage() {
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            const res = await api.get("/departments/");
            setDepartments(res.data.results);
        };
        fetchDepartments();
    }, []);

    const handleCreate = (deptId) => {
        // Може да вземем текущата седмица по default
        const currentWeek = new Date().getWeekNumber(); // виж долу helper
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

    return (
        <Stack spacing={2} p={2}>
            {departments.map((d) => (
                <Card key={d.id}>
                    <CardContent sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6">{d.name}</Typography>
                        <Stack direction="row" spacing={1}>
                            <Button size="small" variant="contained" onClick={() => handleView(d.id)}>View</Button>
                            <Button size="small" variant="outlined" onClick={() => handleCreate(d.id)}>Create</Button>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}

// Helper за week number
Date.prototype.getWeekNumber = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}