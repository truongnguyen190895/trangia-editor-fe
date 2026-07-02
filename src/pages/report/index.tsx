import { useEffect, useState, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { getUserReport } from "@/api/report";
import type { UserReport } from "@/api/report";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { listBranches, type Branch } from "@/api/branchs";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";

const Report = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<UserReport[]>([]);
    const [allReports, setAllReports] = useState<UserReport[]>([]);

    const getInitialDateBegin = () => {
        const startDate = searchParams.get("startDate");
        return startDate ? dayjs(startDate) : dayjs().startOf("month");
    };
    const getInitialDateEnd = () => {
        const endDate = searchParams.get("endDate");
        return endDate ? dayjs(endDate) : dayjs();
    };

    const [dateBegin, setDateBegin] = useState<Dayjs>(getInitialDateBegin());
    const [dateEnd, setDateEnd] = useState<Dayjs>(getInitialDateEnd());
    const [branches, setBranches] = useState<Branch[]>([]);
    const getInitialBranch = () => {
        const branchId = searchParams.get("branch");
        return branchId || null;
    };
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(getInitialBranch());
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
    const isAdmin = userRoles.some(
        (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
    );

    const isInitialMount = useRef(true);

    useEffect(() => {
        listBranches().then((resp) => {
            setBranches(resp);
        });
    }, []);

    useEffect(() => {
        if (branches.length > 0 && selectedBranchId) {
            const branch = branches.find((b) => b.id === selectedBranchId);
            if (branch) {
                setSelectedBranch(branch);
            }
        } else if (!selectedBranchId) {
            setSelectedBranch(null);
        }
    }, [branches, selectedBranchId]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = new URLSearchParams();
        params.set("startDate", dayjs(dateBegin).format("YYYY-MM-DD"));
        params.set("endDate", dayjs(dateEnd).format("YYYY-MM-DD"));
        if (selectedBranchId && isAdmin) {
            params.set("branch", selectedBranchId);
        } else {
            params.delete("branch");
        }
        setSearchParams(params, { replace: true });
    }, [dateBegin, dateEnd, selectedBranchId, isAdmin, setSearchParams]);

    useEffect(() => {
        setLoading(true);
        getUserReport({
            startDate: dayjs(dateBegin).format("YYYY-MM-DD"),
            endDate: dayjs(dateEnd).format("YYYY-MM-DD"),
        })
            .then((res) => {
                setAllReports(res);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dateBegin, dateEnd]);

    useEffect(() => {
        if (selectedBranch) {
            const filtered = allReports.filter(
                (report) => report.branch_name === selectedBranch.friendly_name
            );
            setReports(filtered);
        } else {
            setReports(allReports);
        }
    }, [selectedBranch, allReports]);

    const renderTableContent = () => {
        if (reports.length === 0 && !loading) {
            return (
                <TableRow>
                    <TableCell colSpan={5}>
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
            <PageHeader eyebrow="Báo cáo" title="Báo cáo nhân viên" />
            <Paper variant="outlined" sx={{ p: 2 }}>
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
                    {isAdmin ? (
                        <>
                            <FormControl
                                sx={{ minWidth: 200, width: { xs: "100%", md: "300px" } }}
                            >
                                <InputLabel>Chi nhánh</InputLabel>
                                <Select
                                    label="Chi nhánh"
                                    value={selectedBranchId || ""}
                                    onChange={(e) => {
                                        const branchId = e.target.value || null;
                                        setSelectedBranchId(branchId);
                                    }}
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    {branches.map((branch) => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.friendly_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    ) : null}
                </Box>
            </Paper>
            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                    mt: "2rem",
                    maxWidth: { xs: "90vw", md: "auto" },
                    overflowX: "auto",
                    p: 2,
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" p="2rem">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên nhân viên</TableCell>
                                <TableCell>Chi nhánh</TableCell>
                                <TableCell align="center">CC Hợp Đồng</TableCell>
                                <TableCell align="center">Chứng thực chữ ký</TableCell>
                                <TableCell align="center">Tổng</TableCell>
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
