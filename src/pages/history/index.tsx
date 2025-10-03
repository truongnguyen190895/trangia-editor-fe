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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { listContracts, exportExcel, deleteContract } from "@/api/contract";
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

const DEBOUNCE_TIME = 2000;

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
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.some(
    (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
  );
  const [type, setType] = useState<string>("");
  const [dateBegin, setDateBegin] = useState<Dayjs>(dayjs().startOf("month"));
  const [dateEnd, setDateEnd] = useState<Dayjs>(dayjs());
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

  useEffect(() => {
    const debounce = setTimeout(() => {
      setCustomerQuery(debounceCustomerQuery);
      setPage(1);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(debounce);
  }, [debounceCustomerQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchQuery(debounceQuery);
      setPage(1);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(debounce);
  }, [debounceQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setBrokerQuery(debounceBrokerQuery);
      setPage(1);
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
    })
      .then((resp) => {
        setContracts(resp?.content);
        setTotalPages(resp?.page?.total_pages);
        setTotalElements(resp?.page?.total_elements);
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
  ]);

  useEffect(() => {
    if (isAdmin) {
      setLoadingUsers(true);
      listUsers()
        .then((resp) => {
          setUsers(resp?.content?.filter((user) => user.username !== "admin"));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
  }, [isAdmin]);

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
        <TableCell>{contract.CCCD}</TableCell>
        <TableCell>{contract.ghi_chú}</TableCell>
        <TableCell>
          <Box display="flex" gap="0.2rem" alignItems="center">
            <Button
              variant="contained"
              color="info"
              onClick={() => handleRenderPhieuThu(contract.số_hợp_đồng)}
            >
              <PrintIcon />
            </Button>
            <Button
              variant="outlined"
              color="info"
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
          })
            .then((resp) => {
              setContracts(resp?.content);
              setTotalPages(resp?.page?.total_pages);
              setTotalElements(resp?.page?.total_elements);
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
    <Box>
      <Typography variant="h3" fontWeight={600}>
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
        <Box display="flex" gap="1rem" mt="1rem">
          <Box display="flex" gap="1rem" alignItems="center">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Loại hợp đồng</InputLabel>
              <Select
                sx={{
                  width: "250px",
                }}
                value={type}
                label="Loại hợp đồng"
                onChange={(e) => {
                  setPage(1);
                  setType(e.target.value);
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Contract">Công chứng Hợp Đồng</MenuItem>
                <MenuItem value="Signature">Chứng thực chữ ký</MenuItem>
                <MenuItem value="Invoice">Phiếu thu khác</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" gap="1rem" alignItems="center">
            <DatePicker
              label="Ngày bắt đầu"
              value={dateBegin}
              onChange={(e) => {
                setPage(1);
                setDateBegin(e as Dayjs);
              }}
              format="DD/MM/YYYY"
            />
            <DatePicker
              format="DD/MM/YYYY"
              label="Ngày kết thúc"
              value={dateEnd}
              onChange={(e) => {
                setPage(1);
                setDateEnd(e as Dayjs);
              }}
            />
          </Box>
          {isAdmin ? (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tên chuyên viên</InputLabel>
              <Select
                disabled={loadingUsers}
                sx={{
                  width: "250px",
                }}
                value={selectedUser?.username}
                label="Tên chuyên viên"
                onChange={(e) => {
                  setPage(1);
                  setSelectedUser(
                    users.find((user) => user.username === e.target.value) ||
                      null
                  );
                }}
              >
                <MenuItem value="">Chọn chuyên viên</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.username} value={user.username}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
        <Box display="flex" gap="1rem" mt="1rem">
          <TextField
            sx={{ width: "300px" }}
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
            sx={{ width: "300px" }}
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
            sx={{ width: "300px" }}
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
          fontSize="1.2rem"
          fontWeight="bold"
          fontStyle="italic"
          color="#08CB00"
        >
          Tổng số: {totalElements}
        </Typography>
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
              <Typography>Tải file excel</Typography>
            )}
          </Button>
        ) : null}
      </Box>
      <Box
        mt="1rem"
        border="1px solid #e0e0e0"
        borderRadius="5px"
        px="1rem"
        py="1rem"
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
              <TableCell>CCCD</TableCell>
              <TableCell>Ghi chú</TableCell>
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
      </Box>
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
