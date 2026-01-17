import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    CircularProgress,
} from "@mui/material";
import { getUserReport } from "@/api/report";
import type { UserReport } from "@/api/report";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Report = () => {
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<UserReport[]>([]);
    const [dateBegin, setDateBegin] = useState<Dayjs>(dayjs().startOf("month"));
    const [dateEnd, setDateEnd] = useState<Dayjs>(dayjs());

    useEffect(() => {
        setLoading(true);
        getUserReport({
            startDate: dayjs(dateBegin).format("YYYY-MM-DD"),
            endDate: dayjs(dateEnd).format("YYYY-MM-DD"),
        })
            .then((res) => {
                setReports(res);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dateBegin, dateEnd]);

    const renderTableContent = () => {
        if (reports.length === 0 && !loading) {
            return (
                <TableRow>
                    <TableCell colSpan={6}>
                        <Typography>Không có dữ liệu</Typography>
                    </TableCell>
                </TableRow>
            );
        }
        return reports.map((report, index) => (
            <TableRow key={index}>
                <TableCell>{report.full_name}</TableCell>
                <TableCell>{report.branch_name}</TableCell>
                <TableCell align="center">{report.report.contract}</TableCell>
                <TableCell align="center">{report.report.signature}</TableCell>
                <TableCell align="center">{report.report.contract + report.report.signature}</TableCell>
            </TableRow>
        ));
    };

    return (
        <Box sx={{ width: { xs: "100%", md: "auto" } }}>
            <Typography
                sx={{ fontSize: { xs: "1.2rem", md: "2rem" } }}
                fontWeight={600}
            >
                Báo cáo nhân viên
            </Typography>
            <Box
                mt="2rem"
                border="1px solid #e0e0e0"
                borderRadius="5px"
                px="1rem"
                py="1rem"
            >
                <Box display="flex" gap="0.5rem" alignItems="center">
                    <Typography variant="h6">Lọc dữ liệu</Typography>
                    <FilterAltIcon />
                </Box>
                <Box
                    display="flex"
                    gap="1rem"
                    mt="1rem"
                    flexWrap="wrap"
                    width={{ xs: "100%", md: "auto" }}
                >
                    <DatePicker
                        label="Ngày bắt đầu"
                        format="DD/MM/YYYY"
                        sx={{ width: { xs: "100%", md: "300px" } }}
                        value={dateBegin}
                        onChange={(e) => {
                            setDateBegin(e as Dayjs);
                        }}
                    />
                    <DatePicker
                        label="Ngày kết thúc"
                        format="DD/MM/YYYY"
                        sx={{ width: { xs: "100%", md: "300px" } }}
                        value={dateEnd}
                        onChange={(e) => {
                            setDateEnd(e as Dayjs);
                        }}
                    />
                </Box>
            </Box>
            <TableContainer
                sx={{
                    mt: "2rem",
                    maxWidth: { xs: "90vw", md: "auto" },
                    overflowX: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: "5px",
                    px: "1rem",
                    py: "1rem",
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" p="2rem">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography fontWeight={600}>Tên nhân viên</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>Chi nhánh</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>CC Hợp Đồng</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>Chứng thực chữ ký</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>Tổng</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderTableContent()}</TableBody>
                    </Table>
                )}
            </TableContainer>
        </Box>
    );
};

export default Report;
