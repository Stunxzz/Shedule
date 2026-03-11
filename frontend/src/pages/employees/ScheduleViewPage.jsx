import { useState, useEffect } from "react";
import ScheduleGrid from "../../components/employee/ScheduleGrid.jsx";
import api from "../../api/axios.js";
import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function ScheduleViewPage() {
    const { departmentId, week } = useParams();
    const year = new Date().getFullYear();

    const [weekDays, setWeekDays] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [changes, setChanges] = useState({});

    const weekNumber = week;

    const fetchData = async () => {
        try {
            const daysRes = await api.get(`/week-days/?week=${weekNumber}&year=${year}`);
            setWeekDays(daysRes.data);

            // Взимаме служителите за отдела + personal_number
            const empRes = await api.get(`/department-employees/?department=${departmentId}`);
            setEmployees(empRes.data);

            const schedRes = await api.get(`/week-schedule/?department=${departmentId}&week=${weekNumber}&year=${year}`);
            setSchedule(schedRes.data);

            setChanges({});
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [departmentId, week]);

    const scheduleMap = {};
    schedule.forEach(item => {
        const key = `${item.employee}_${item.date}`;
        scheduleMap[key] = item;
    });

    // View mode не позволява промени
    const onCellChange = () => {};

    return (
        <Box p={2}>
            {/* Legend */}
            <Stack direction="row" spacing={1} mb={2}>
                {["1","2","3","H","S"].map(shift => (
                    <Box key={shift} sx={{
                        width:32, height:32,
                        backgroundColor: shift==="1"? "#FFD700": shift==="2"? "#1E90FF": shift==="3"? "#8A2BE2": shift==="H"? "#2ECC71":"#E74C3C",
                        display:"flex", justifyContent:"center", alignItems:"center", borderRadius:1
                    }}>
                        <Typography sx={{fontSize:"0.75rem", color:"#fff"}}>{shift}</Typography>
                    </Box>
                ))}
            </Stack>

            {/* Grid */}
            <ScheduleGrid
                employees={employees}
                weekDays={weekDays}
                schedule={schedule}
                changes={changes}
                selectedEmployees={[]}
                selectedDays={[]}
                setSelectedEmployees={() => {}}
                setSelectedDays={() => {}}
                onCellChange={onCellChange}
                readOnly={true}  // предаваме проп за read-only
            />
        </Box>
    );
}