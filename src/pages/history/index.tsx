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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { listContracts, exportExcel, updateContract } from "@/api/contract";
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

interface ContractRow {
  tenChuyenVien: string | null;
  số_hợp_đồng: string;
  tên_hợp_đồng: string;
  tên_khách_hàng: string;
  CCCD: string | null;
  số_tiền: number;
  bản_sao: number;
  quan_hệ: string;
  ghi_chú: string;
}

const History = () => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ContractRow | null>(null);
  const [page, setPage] = useState(1);
  const [size, _setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.some(
    (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
  );
  const [type, setType] = useState<string>("");
  const [dateBegin, setDateBegin] = useState<Dayjs>(dayjs().startOf("month"));
  const [dateEnd, setDateEnd] = useState<Dayjs>(dayjs().add(1, "day"));
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    setLoading(true);
    listContracts({
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
  }, [page, size, type, dateBegin, dateEnd, selectedUser]);

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
      ngay: dayjs(contract.date).format("DD/MM/YYYY"),
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

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedRow(null);
  };

  const handleUpdateContract = () => {
    const targetedContract = contracts.find(
      (contract) => contract.id === selectedRow?.số_hợp_đồng
    );
    if (targetedContract) {
      const payload = {
        id: targetedContract.id,
        name: selectedRow?.tên_hợp_đồng || "",
        customer: selectedRow?.tên_khách_hàng || "",
        broker: selectedRow?.quan_hệ || "",
        value: selectedRow?.số_tiền || 0,
        copiesValue: selectedRow?.bản_sao || 0,
        notes: selectedRow?.ghi_chú || "",
        unit: targetedContract?.unit,
        relationship: selectedRow?.quan_hệ || "",
        nationalId: selectedRow?.CCCD || "",
      };
      updateContract(payload)
        .then(() => {
          listContracts({
            size,
            page,
            type,
            dateBegin: dayjs(dateBegin).format("YYYY-MM-DD"),
            dateEnd: dayjs(dateEnd).format("YYYY-MM-DD"),
            createdBy: selectedUser?.username,
          })
            .then((resp) => setContracts(resp?.content))
            .finally(() => {
              setLoading(false);
            });
        })
        .finally(() => {
          setOpenUpdate(false);
          setSelectedRow(null);
        });
    }
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
        <TableCell>{contract.số_hợp_đồng}</TableCell>
        <TableCell>{contract.tên_hợp_đồng}</TableCell>
        <TableCell>{contract.tên_khách_hàng}</TableCell>
        <TableCell>{contract.CCCD}</TableCell>
        <TableCell>{contract.số_tiền?.toLocaleString()}</TableCell>
        <TableCell>{contract.bản_sao?.toLocaleString()}</TableCell>
        <TableCell>{contract.quan_hệ}</TableCell>
        <TableCell>{contract.ghi_chú}</TableCell>
        <TableCell>
          <Box display="flex" gap="1rem" alignItems="center">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setSelectedRow(contract);
                setOpenUpdate(true);
              }}
            >
              Sửa
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handleRenderPhieuThu(contract.số_hợp_đồng)}
            >
              Phiếu thu
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  const handleRenderPhieuThu = (id: string) => {
    const contract = contracts.find((contract) => contract.id === id);
    if (contract) {
      const payload: PhieuThuPayload = {
        ...contract,
        d: dayjs(contract.date).format("DD"),
        m: dayjs(contract.date).format("MM"),
        y: dayjs(contract.date).format("YYYY"),
        người_nộp_tiền: contract?.customer || "",
        số_cc: contract?.id?.toString() || "",
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
      <Typography variant="h4">Danh sách phiếu thu</Typography>
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
              <TableCell>CCCD</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Bản sao</TableCell>
              <TableCell>Quan hệ</TableCell>
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
      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Sửa hợp đồng</DialogTitle>
        <DialogContent>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap="20px"
            py="20px"
          >
            <TextField
              label="Số hợp đồng"
              value={selectedRow?.số_hợp_đồng}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  số_hợp_đồng: e.target.value as string,
                })
              }
            />
            <TextField
              label="Tên hợp đồng"
              value={selectedRow?.tên_hợp_đồng}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  tên_hợp_đồng: e.target.value as string,
                })
              }
            />
            <TextField
              label="Tên khách hàng"
              value={selectedRow?.tên_khách_hàng}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  tên_khách_hàng: e.target.value as string,
                })
              }
            />
            <TextField
              label="CCCD"
              value={selectedRow?.CCCD}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  CCCD: e.target.value as string,
                })
              }
            />
            <TextField
              label="Số tiền"
              type="number"
              value={selectedRow?.số_tiền}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  số_tiền: Number(e.target.value),
                })
              }
            />
            <TextField
              label="Số tiền làm bản sao"
              type="number"
              value={selectedRow?.bản_sao}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  bản_sao: Number(e.target.value),
                })
              }
            />
            <TextField
              label="Quan hệ"
              value={selectedRow?.quan_hệ}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  quan_hệ: e.target.value as string,
                })
              }
            />
            <TextField
              label="Ghi chú"
              value={selectedRow?.ghi_chú}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow!,
                  ghi_chú: e.target.value as string,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate}>Hủy</Button>
          <Button variant="contained" onClick={handleUpdateContract}>
            Sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default History;
