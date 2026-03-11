import {Table, TableHead, TableBody, TableRow, TableCell, TextField, Checkbox} from "@mui/material";

const shiftColors = {
    "1": "#FFD700",
    "2": "#1E90FF",
    "3": "#800080",
    "H": "#28a745",
    "S": "#dc3545"
};

export default function ScheduleGrid({
                                         employees,
                                         weekDays,
                                         schedule,
                                         changes,
                                         selectedEmployees,
                                         selectedDays,
                                         setSelectedEmployees,
                                         setSelectedDays,
                                         onCellChange,
                                         readOnly = false // нов проп за view mode
                                     }) {

    const scheduleMap = {};
    schedule.forEach(entry => {
        scheduleMap[`${entry.employee}_${entry.date}`] = entry;
    });

    const toggleEmployee = (empId) => {
        if (selectedEmployees.includes(empId)) setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
        else setSelectedEmployees([...selectedEmployees, empId]);
    };

    const toggleDay = (date) => {
        if (selectedDays.includes(date)) setSelectedDays(selectedDays.filter(d => d !== date));
        else setSelectedDays([...selectedDays, date]);
    };

    const handleShiftChange = (empId, date, value) => {
        if (readOnly) return;
        const key = `${empId}_${date}`;
        let shift = value.toUpperCase();
        if (!["1", "2", "3", "H", "S"].includes(shift)) shift = "";
        const existing = changes[key] || scheduleMap[key] || {};
        onCellChange(empId, date, shift, existing.working_place || "");
    };

    const handleLaneChange = (empId, date, value) => {
        if (readOnly) return;
        const key = `${empId}_${date}`;
        const existing = changes[key] || scheduleMap[key] || {};
        onCellChange(empId, date, existing.shift || "", value);
    };

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Personal #</TableCell>
                        <TableCell>Employee / Day</TableCell>
                        {weekDays.map(day => (
                            <TableCell key={day.date}>
                                <div>{day.label}</div>
                                <div>{day.day}</div>
                                {!readOnly && (
                                    <Checkbox
                                        checked={selectedDays.includes(day.date)}
                                        onChange={() => toggleDay(day.date)}
                                    />
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {employees.map(emp => (
                        <TableRow key={emp.id}>
                            <TableCell>{emp.personal_number}</TableCell>
                            <TableCell>
                                <div>{emp.name}</div>
                                {!readOnly && (
                                    <Checkbox
                                        checked={selectedEmployees.includes(emp.id)}
                                        onChange={() => toggleEmployee(emp.id)}
                                    />
                                )}
                            </TableCell>

                            {weekDays.map(day => {
                                const key = `${emp.id}_${day.date}`;
                                const entry = changes[key] || scheduleMap[key] || {};
                                const bgColor = shiftColors[entry.shift] || "transparent";

                                return (
                                    <TableCell key={key} sx={{transition: "0.2s"}}>
                                        {readOnly ? (
                                            <div style={{
                                                backgroundColor: bgColor,
                                                textAlign: "center",
                                                borderRadius: "4px",
                                                padding: "2px 4px"
                                            }}>
                                                {entry.shift || ""} {entry.working_place || ""}
                                            </div>
                                        ) : (
                                            <>
                                                <TextField
                                                    value={entry.shift || ""}
                                                    onChange={e => handleShiftChange(emp.id, day.date, e.target.value)}
                                                    placeholder="-"
                                                    size="small"
                                                    sx={{
                                                        width: "40px",
                                                        textAlign: "center",
                                                        mb: 0.5,
                                                        backgroundColor: bgColor
                                                    }}
                                                />
                                                <TextField
                                                    value={entry.working_place || ""}
                                                    onChange={e => handleLaneChange(emp.id, day.date, e.target.value)}
                                                    placeholder="Lane"
                                                    size="small"
                                                    sx={{width: "70px", fontSize: "0.85rem"}}
                                                />
                                            </>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}