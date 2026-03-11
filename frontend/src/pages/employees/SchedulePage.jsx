import {useState, useEffect} from "react";
import ScheduleGrid from "../../components/employee/ScheduleGrid.jsx"
import api from "../../api/axios.js";
import {Button, Stack, TextField, Box, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

export default function SchedulePage({mode}) {
    const {departmentId, week} = useParams();
    const year = new Date().getFullYear();

    const [weekDays, setWeekDays] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [changes, setChanges] = useState({});
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [bulkLane, setBulkLane] = useState("");

    const weekNumber = week;

    const fetchData = async () => {
        const daysRes = await api.get(`/week-days/?week=${weekNumber}&year=${year}`);
        setWeekDays(daysRes.data);

        const empRes = await api.get(`/department-employees/?department=${departmentId}`);
        setEmployees(empRes.data);

        const schedRes = await api.get(`/week-schedule/?department=${departmentId}&week=${weekNumber}&year=${year}`);
        setSchedule(schedRes.data);
        setChanges({});
    };

    useEffect(() => {
        fetchData();
    }, [departmentId, week]);

    const scheduleMap = {};
    schedule.forEach(item => {
        scheduleMap[`${item.employee}_${item.date}`] = item
    });

    const onCellChange = (empId, date, shift, working_place) => {
        if (mode === "view") return;
        const key = `${empId}_${date}`;
        setChanges(prev => ({
            ...prev,
            [key]: {employee: empId, date, shift, working_place}
        }));
    };

    const handleShiftBulkAssign = (shift) => {
        if (mode === "view") return;
        const newChanges = {...changes};
        selectedEmployees.forEach(empId => {
            selectedDays.forEach(date => {
                const key = `${empId}_${date}`;
                const existing = newChanges[key] || scheduleMap[key] || {};
                newChanges[key] = {employee: empId, date, shift, working_place: existing.working_place || ""};
            });
        });
        setChanges(newChanges);
    };

    const handleLaneBulkAssign = () => {
        if (mode === "view" || !bulkLane) return;
        const newChanges = {...changes};
        selectedEmployees.forEach(empId => {
            selectedDays.forEach(date => {
                const key = `${empId}_${date}`;
                const existing = newChanges[key] || scheduleMap[key] || {};
                newChanges[key] = {employee: empId, date, shift: existing.shift || "", working_place: bulkLane};
            });
        });
        setChanges(newChanges);
        setBulkLane("");
    };

    const handleBulkLaneEnter = (e) => {
        if (e.key === "Enter") handleLaneBulkAssign();
    };

    const handleSave = async () => {
        if (mode === "view") return;
        const payload = Object.values(changes).map(c => ({
            employee: c.employee,
            date: c.date,
            shift: c.shift || "1",
            working_place: c.working_place || ""
        }));
        if (!payload.length) return;
        await api.post("/bulk-schedule/", payload);
        setChanges({});
        await fetchData();
        setSelectedEmployees([]);
        setSelectedDays([]);
    };

    return (
        <Box p={2}>
            {/* Legend */}
            <Stack direction="row" spacing={1} mb={2}>
                {["1", "2", "3", "H", "S"].map(shift => (
                    <Box key={shift} sx={{
                        width: 32, height: 32, backgroundColor: shift === "1" ? "#FFD700" :
                            shift === "2" ? "#1E90FF" : shift === "3" ? "#8A2BE2" : shift === "H" ? "#2ECC71" : "#E74C3C",
                        display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 1
                    }}>
                        <Typography sx={{fontSize: "0.75rem", color: "#fff"}}>{shift}</Typography>
                    </Box>
                ))}
            </Stack>

            {mode !== "view" &&
                <>
                    {/* SHIFT BUTTONS */}
                    <Stack direction="row" spacing={1} mb={2} alignItems="center">
                        {["1", "2", "3", "H", "S"].map(shift => (
                            <Button key={shift} onClick={() => handleShiftBulkAssign(shift)}
                                    variant="contained" sx={{
                                minWidth: 32, width: 32, height: 32, padding: 0, fontSize: "0.75rem", borderRadius: 1,
                                backgroundColor: shift === "1" ? "#FFD700" : shift === "2" ? "#1E90FF" : shift === "3" ? "#8A2BE2" : shift === "H" ? "#2ECC71" : "#E74C3C"
                            }}>{shift}</Button>
                        ))}
                    </Stack>

                    {/* BULK LANE */}
                    <Stack direction="row" spacing={1} mb={2}>
                        <TextField size="small" placeholder="Lane" value={bulkLane}
                                   onChange={e => setBulkLane(e.target.value)} onKeyDown={handleBulkLaneEnter}
                                   sx={{width: 150}}/>
                        <Button size="small" variant="contained" onClick={handleLaneBulkAssign}>Assign</Button>
                        <Button size="small" variant="contained" color="secondary" onClick={handleSave}>Save</Button>
                    </Stack>
                </>}

            {/* GRID */}
            <ScheduleGrid
                employees={employees}
                weekDays={weekDays}
                schedule={schedule}
                changes={changes}
                selectedEmployees={selectedEmployees}
                selectedDays={selectedDays}
                setSelectedEmployees={setSelectedEmployees}
                setSelectedDays={setSelectedDays}
                onCellChange={onCellChange}
            />
        </Box>
    );
}