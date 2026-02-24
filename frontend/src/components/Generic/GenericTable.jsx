// frontend/src/components/Generic/GenericTable.jsx
import React from "react";
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    TablePagination, TextField, CircularProgress, Box,
    Paper, Card, CardContent, Typography, Stack,
    useTheme, useMediaQuery, Button
} from "@mui/material";

export const GenericTable = ({
                                 columns,
                                 data = [],
                                 page = 1,
                                 setPage = () => {
                                 },
                                 pageSize = 5,
                                 setPageSize = () => {
                                 },
                                 total = 0,
                                 search = "",
                                 setSearch = () => {
                                 },
                                 loading = false,
                                 headerActions = null,
                             }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                maxWidth: 1200,
                mx: "auto",
                px: {xs: 2, md: 4},
                mt: 6,
            }}
        >
            {headerActions && (
                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    {React.cloneElement(headerActions, {
                        sx: {
                            background:
                                "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                            color: "white",
                            fontWeight: 600,
                            px: 4,
                            py: 1.2,
                            borderRadius: 3,
                            textTransform: "none",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                            transition: "all 0.3s ease",

                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
                                background:
                                    "linear-gradient(90deg, #3f9ae6 0%, #00d4e6 100%)",
                            },
                        },
                    })}
                </Box>
            )}

            <TextField
                label="Search"
                fullWidth
                size="small"
                sx={{mb: 2}}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Paper elevation={3} sx={{borderRadius: 3, overflow: "hidden"}}>
                {loading ? (
                    <Box p={4} textAlign="center">
                        <CircularProgress/>
                    </Box>
                ) : data.length === 0 ? (
                    <Box p={4} textAlign="center">No data</Box>
                ) : isMobile ? (
                    // MOBILE CARD VIEW
                    <Box p={2}>
                        <Stack spacing={2}>
                            {data.map((row) => (
                                <Card key={row.id} elevation={2} sx={{borderRadius: 3}}>
                                    <CardContent>
                                        <Stack spacing={1}>
                                            {columns.map((col) => (
                                                <Box key={col.field}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {col.label}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {col.render ? col.render(row) : row[col.field]}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    // DESKTOP TABLE VIEW
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={col.field} align="center" sx={{fontWeight: 600}}>
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id} hover>
                                    {columns.map((col) => (
                                        <TableCell key={col.field} align="center">
                                            {col.render ? col.render(row) : row[col.field]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <TablePagination
                    component="div"
                    count={total}
                    page={page - 1}
                    onPageChange={(e, newPage) => setPage(newPage + 1)}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Paper>
        </Box>
    );
};