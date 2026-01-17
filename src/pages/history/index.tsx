import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Button,
    CircularProgress,
    Pagination,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    TextField,
    Autocomplete,
    TableContainer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { listContracts, exportExcel, deleteContract } from "@/api/contract";
import { listBranches, type Branch } from "@/api/branchs";
import { render_phieu_thu, type PhieuThuPayload } from "@/api";
import type { Contract } from "@/api/contract";
import dayjs, { type Dayjs } from "dayjs";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { numberToVietnamese } from "@/utils/number-to-words";
import { LoadingDialog } from "@/components/common/loading-dialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { listUsers, type User } from "@/api/users";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { toast } from "react-toastify";

const DEBOUNCE_TIME = 1000;

const History = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [page, setPage] = useState(1);
    const [size, _setSize] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [type, setType] = useState<string>("");
    const [dateBegin, setDateBegin] = useState<Dayjs>(dayjs().startOf("month"));
    const [dateEnd, setDateEnd] = useState<Dayjs>(dayjs());
    const [branchs, setBranchs] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [debounceQuery, setDebounceQuery] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [brokerQuery, setBrokerQuery] = useState<string>("");
    const [debounceBrokerQuery, setDebounceBrokerQuery] = useState<string>("");
    const [customerQuery, setCustomerQuery] = useState<string>("");
    const [debounceCustomerQuery, setDebounceCustomerQuery] =
        useState<string>("");
    const [totalCopiesValue, setTotalCopiesValue] = useState(0);
    const [totalValue, setTotalValue] = useState(0);

    const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
    const isAdmin = userRoles.some(
        (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
    );
    const isBranchManager = userRoles.some(
        (role: string) => role === "ROLE_BranchManager"
    );

    console.log("isBranchManager", isBranchManager);

    useEffect(() => {
        listBranches().then((resp) => {
            setBranchs(resp);
        });
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setCustomerQuery(debounceCustomerQuery);
            setPage(1);
            setDateBegin(
                debounceCustomerQuery !== ""
                    ? dayjs(dateBegin).startOf("year")
                    : dayjs().startOf("month")
            );
        }, DEBOUNCE_TIME);
        return () => clearTimeout(debounce);
    }, [debounceCustomerQuery]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setSearchQuery(debounceQuery);
            setPage(1);
            setDateBegin(
                debounceQuery !== ""
                    ? dayjs(dateBegin).startOf("year")
                    : dayjs().startOf("month")
            );
        }, DEBOUNCE_TIME);
        return () => clearTimeout(debounce);
    }, [debounceQuery]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setBrokerQuery(debounceBrokerQuery);
            setPage(1);
            setDateBegin(
                debounceBrokerQuery !== ""
                    ? dayjs(dateBegin).startOf("year")
                    : dayjs().startOf("month")
            );
        }, DEBOUNCE_TIME);
        return () => clearTimeout(debounce);
    }, [debounceBrokerQuery]);

    useEffect(() => {
        setLoading(true);
        listContracts({
            customer: customerQuery,
            sort: "audit.createdAt,desc",
            broker: brokerQuery,
            id: searchQuery,
            size,
            page: page - 1,
            type,
            dateBegin: dayjs(dateBegin).format("YYYY-MM-DD"),
            dateEnd: dayjs(dateEnd).format("YYYY-MM-DD"),
            createdBy: selectedUser?.username,
            unit: selectedBranch?.id,
        })
            .then((resp) => {
                setContracts(resp?.content);
                setTotalPages(resp?.page?.total_pages);
                setTotalElements(resp?.page?.total_elements);
                setTotalCopiesValue(resp?.total_copies_value);
                setTotalValue(resp?.total_value);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [
        page,
        size,
        type,
        dateBegin,
        dateEnd,
        selectedUser,
        searchQuery,
        brokerQuery,
        customerQuery,
        selectedBranch?.id,
    ]);

    useEffect(() => {
        if (isAdmin || isBranchManager) {
            setLoadingUsers(true);
            listUsers({ size: 1000 })
                .then((resp) => {
                    setUsers(resp?.content?.filter((user) => user.username !== "admin"));
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setLoadingUsers(false);
                });
        }
    }, [isAdmin, isBranchManager]);

    const cleanData = contracts.map((contract) => {
        return {
            ngay: dayjs(contract.filed_date).format("DD/MM/YYYY"),
            tenChuyenVien: contract?.created_by,
            số_hợp_đồng: contract?.id,
            tên_hợp_đồng: contract?.name,
            tên_khách_hàng: contract?.customer,
            CCCD: contract?.national_id,
            số_tiền: contract?.value,
            bản_sao: contract?.copies_value,
            quan_hệ: contract?.broker,
            ghi_chú: contract?.notes,
            người_giao: contract?.delivered_by,
            người_kiểm_tra: contract?.inspected_by,
            ký_ngoài: contract?.external_notes,
        };
    });

    const handleExportExcel = () => {
        setLoadingExcel(true);
        exportExcel({
            sort: "audit.createdAt,desc",
            customer: customerQuery,
            broker: brokerQuery,
            id: searchQuery,
            type,
            size: 1000000,
            dateBegin: dayjs(dateBegin).format("YYYY-MM-DD"),
            dateEnd: dayjs(dateEnd).format("YYYY-MM-DD"),
            createdBy: selectedUser?.username,
            unit: selectedBranch?.id,
        })
            .then((res) => {
                const blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `bao-cao-${dayjs().format("YYYY-MM-DD")}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .finally(() => {
                setLoadingExcel(false);
            });
    };

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const renderTableContent = () => {
        if (cleanData.length === 0 && !loading) {
            return (
                <TableRow>
                    <TableCell colSpan={12}>
                        <Typography>Không có dữ liệu</Typography>
                    </TableCell>
                </TableRow>
            );
        }
        return cleanData.map((contract) => (
            <TableRow key={contract.số_hợp_đồng}>
                <TableCell>{contract.ngay}</TableCell>
                <TableCell>{contract.tenChuyenVien}</TableCell>
                <TableCell>
                    {contract.số_hợp_đồng?.includes("!") ? "Khác" : contract.số_hợp_đồng}
                </TableCell>
                <TableCell>{contract.tên_hợp_đồng}</TableCell>
                <TableCell>{contract.tên_khách_hàng}</TableCell>
                <TableCell>{contract.số_tiền?.toLocaleString()}</TableCell>
                <TableCell>{contract.bản_sao?.toLocaleString()}</TableCell>
                <TableCell>{contract.quan_hệ}</TableCell>
                <TableCell>{contract.người_giao}</TableCell>
                <TableCell>{contract.người_kiểm_tra}</TableCell>
                <TableCell>{contract.ký_ngoài}</TableCell>
                <TableCell>
                    <Box display="flex" gap="0.2rem" alignItems="center">
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => handleRenderPhieuThu(contract.số_hợp_đồng)}
                        >
                            <PrintIcon />
                        </Button>
                        <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            onClick={() => {
                                navigate(`/edit-contract?id=${contract.số_hợp_đồng}`);
                            }}
                        >
                            <EditIcon />
                        </Button>
                        {isAdmin ? (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {
                                    setIdToDelete(contract.số_hợp_đồng);
                                    setOpenConfirmationDialog(true);
                                }}
                            >
                                <DeleteIcon />
                            </Button>
                        ) : null}
                    </Box>
                </TableCell>
            </TableRow>
        ));
    };

    const handleDeleteContract = () => {
        if (idToDelete) {
            deleteContract(idToDelete)
                .then(() => {
                    listContracts({
                        sort: "audit.createdAt,desc",
                        customer: customerQuery,
                        broker: brokerQuery,
                        id: searchQuery,
                        size,
                        page: page - 1,
                        type,
                        dateBegin: dayjs(dateBegin).format("YYYY-MM-DD"),
                        dateEnd: dayjs(dateEnd).format("YYYY-MM-DD"),
                        createdBy: selectedUser?.username,
                        unit: selectedBranch?.id,
                    })
                        .then((resp) => {
                            setContracts(resp?.content);
                            setTotalPages(resp?.page?.total_pages);
                            setTotalElements(resp?.page?.total_elements);
                            setTotalCopiesValue(resp?.total_copies_value);
                            setTotalValue(resp?.total_value);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                    toast.success("Xóa phiếu thu thành công");
                })
                .catch((err) => {
                    toast.error("Lỗi xoá phiếu thu");
                    console.error(err);
                })
                .finally(() => {
                    setOpenConfirmationDialog(false);
                    setIdToDelete(null);
                });
        }
    };

    const handleRenderPhieuThu = (id: string) => {
        const contract = contracts.find((contract) => contract.id === id);
        if (contract) {
            let contractType = "";
            if (contract.id.includes("/")) {
                contractType = "Contract";
            } else if (contract.id.includes(".")) {
                contractType = "Signature";
            } else {
                contractType = "Invoice";
            }

            let idPhieuThu = "";
            if (contractType === "Contract") {
                idPhieuThu = contract.id?.slice(0, -5);
            } else {
                idPhieuThu = contract.id;
            }
            const payload: PhieuThuPayload = {
                ...contract,
                d: dayjs(contract.filed_date).format("DD"),
                m: dayjs(contract.filed_date).format("MM"),
                y: dayjs(contract.filed_date).format("YYYY"),
                người_nộp_tiền: contract?.customer || "",
                số_cc: contractType === "Invoice" ? null : idPhieuThu,
                số_tiền: (
                    (contract?.value * 1000 || 0) + (contract?.copies_value * 1000 || 0)
                ).toLocaleString(),
                số_tiền_bằng_chữ: numberToVietnamese(
                    (
                        (contract?.value * 1000 || 0) + (contract?.copies_value * 1000 || 0)
                    ).toString()
                ),
                tên_chuyên_viên: contract?.created_by || "",
                loại_hđ: contract?.name || "",
                ghi_chú: `(Công chứng: ${(
                    contract?.value * 1000 || 0
                )?.toLocaleString()}đ; Bản sao: ${(
                    contract?.copies_value * 1000 || 0
                )?.toLocaleString()}đ)`,
                lý_do_nộp:
                    contractType === "Invoice"
                        ? contract?.name
                        : `Phí, giá dịch vụ yêu cầu theo hồ sơ cc ${contract?.name} số:`,
            };
            render_phieu_thu(payload)
                .then((res) => {
                    const blob = new Blob([res.data], {
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "phieu-thu-tt200.docx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch((err) => {
                    console.error("Error generating document:", err);
                    window.alert("Lỗi khi tạo phiếu thu");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            window.alert("Không tìm thấy hợp đồng");
        }
    };

    const handleChangePage = (
        _event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    return (
        <Box sx={{ width: { xs: "100%", md: "auto" } }}>
            <Typography
                sx={{ fontSize: { xs: "1.2rem", md: "2rem" } }}
                fontWeight={600}
            >
                Danh sách phiếu thu
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
                    <FormControl
                        sx={{ minWidth: 200, width: { xs: "100%", md: "220px" } }}
                    >
                        <InputLabel>Loại hợp đồng</InputLabel>
                        <Select
                            value={type}
                            label="Loại hợp đồng"
                            onChange={(e) => {
                                setPage(1);
                                setType(e.target.value);
                            }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Contract">CC Hợp Đồng</MenuItem>
                            <MenuItem value="Signature">Chứng thực chữ ký</MenuItem>
                            <MenuItem value="Invoice">Phiếu thu khác</MenuItem>
                        </Select>
                    </FormControl>
                    <DatePicker
                        label="Ngày bắt đầu"
                        format="DD/MM/YYYY"
                        sx={{ width: { xs: "100%", md: "180px" } }}
                        value={dateBegin}
                        onChange={(e) => {
                            setPage(1);
                            setDateBegin(e as Dayjs);
                        }}
                    />
                    <DatePicker
                        label="Ngày kết thúc"
                        format="DD/MM/YYYY"
                        sx={{ width: { xs: "100%", md: "180px" } }}
                        value={dateEnd}
                        onChange={(e) => {
                            setPage(1);
                            setDateEnd(e as Dayjs);
                        }}
                    />
                    {isAdmin || isBranchManager ? (
                        <Autocomplete
                            disabled={loadingUsers}
                            options={users}
                            getOptionLabel={(option) => option.name}
                            value={selectedUser}
                            isOptionEqualToValue={(option, value) =>
                                option.username === value?.username
                            }
                            onChange={(_, newValue) => {
                                setPage(1);
                                setSelectedUser(newValue || null);
                            }}
                            sx={{ minWidth: 200, width: { xs: "100%", md: "250px" } }}
                            renderInput={(params) => (
                                <TextField {...params} label="Tên chuyên viên" />
                            )}
                        />
                    ) : null}
                    {isAdmin ? (
                        <>
                            <FormControl
                                sx={{ minWidth: 200, width: { xs: "100%", md: "230px" } }}
                            >
                                <InputLabel>Đơn vị</InputLabel>
                                <Select
                                    label="Đơn vị"
                                    value={selectedBranch?.id}
                                    onChange={(e) => {
                                        setPage(1);
                                        setSelectedBranch(
                                            branchs.find((branch) => branch.id === e.target.value) ||
                                            null
                                        );
                                    }}
                                >
                                    <MenuItem value="">Chọn đơn vị</MenuItem>
                                    {branchs.map((branch) => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.friendly_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    ) : null}
                </Box>
            </Box>
            <Box
                mt="2rem"
                border="1px solid #e0e0e0"
                borderRadius="5px"
                px="1rem"
                py="1rem"
            >
                <Box display="flex" gap="0.5rem" alignItems="center">
                    <Typography variant="h6">Tìm kiếm</Typography>
                    <SearchIcon />
                </Box>
                <Box
                    display="flex"
                    gap="1rem"
                    mt="1rem"
                    flexWrap="wrap"
                    width={{ xs: "100%", md: "auto" }}
                >
                    <TextField
                        sx={{ width: { xs: "100%", md: "300px" } }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        label="Tìm theo số Hợp đồng"
                        placeholder="Nhập số Hợp đồng"
                        value={debounceQuery}
                        onChange={(e) => {
                            setDebounceQuery(e.target.value);
                        }}
                    />
                    <TextField
                        sx={{ width: { xs: "100%", md: "300px" } }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        label="Tìm theo quan hệ"
                        placeholder="Nhập tên môi giới"
                        value={debounceBrokerQuery}
                        onChange={(e) => {
                            setDebounceBrokerQuery(e.target.value);
                        }}
                    />
                    <TextField
                        sx={{ width: { xs: "100%", md: "300px" } }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        label="Tìm theo tên khách hàng"
                        placeholder="Nhập tên khách hàng"
                        value={debounceCustomerQuery}
                        onChange={(e) => {
                            setDebounceCustomerQuery(e.target.value);
                        }}
                    />
                </Box>
            </Box>
            <Box
                mt="2rem"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography
                    sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
                    fontWeight="bold"
                    fontStyle="italic"
                    color="#08CB00"
                >
                    Tổng số: {totalElements}
                </Typography>
                {isAdmin ? (
                    <Typography
                        sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
                        fontWeight="bold"
                        fontStyle="italic"
                        color="#08CB00"
                    >
                        Tổng tiền:{" "}
                        {((totalValue + totalCopiesValue) * 1000).toLocaleString()}
                    </Typography>
                ) : null}
                {isAdmin ? (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: "green",
                            width: "200px",
                            height: "40px",
                        }}
                        endIcon={<FileDownloadIcon sx={{ fontSize: "large" }} />}
                        onClick={handleExportExcel}
                        disabled={loadingExcel}
                    >
                        {loadingExcel ? (
                            <CircularProgress size={20} />
                        ) : (
                            <Typography sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}>
                                Tải file excel
                            </Typography>
                        )}
                    </Button>
                ) : null}
            </Box>
            <TableContainer
                sx={{
                    mt: "1rem",
                    maxWidth: { xs: "90vw", md: "auto" },
                    overflowX: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: "5px",
                    px: "1rem",
                    py: "1rem",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ngày viết phiếu</TableCell>
                            <TableCell>Tên chuyên viên</TableCell>
                            <TableCell>Số HĐ</TableCell>
                            <TableCell>Tên HĐ</TableCell>
                            <TableCell>Tên KH</TableCell>
                            <TableCell>Số tiền</TableCell>
                            <TableCell>Bản sao</TableCell>
                            <TableCell>Quan hệ</TableCell>
                            <TableCell>Người giao</TableCell>
                            <TableCell>Người kiểm tra</TableCell>
                            <TableCell>Ký ngoài</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderTableContent()}</TableBody>
                </Table>
                <Box
                    className="pagination-container"
                    display="flex"
                    justifyContent="center"
                    mt="2rem"
                >
                    <Pagination
                        count={totalPages}
                        page={page}
                        shape="rounded"
                        onChange={handleChangePage}
                    />
                </Box>
            </TableContainer>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Cập nhật dữ liệu thành công
                </Alert>
            </Snackbar>
            <LoadingDialog open={loading} />
            <ConfirmationDialog
                open={openConfirmationDialog}
                title="Xác nhận"
                message="Bạn có chắc chắn muốn xóa phiếu thu này không?"
                onConfirm={handleDeleteContract}
                onCancel={() => setOpenConfirmationDialog(false)}
            />
        </Box>
    );
};

export default History;
