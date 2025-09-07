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
} from "@mui/material";
import { listContracts, exportExcel, updateContract } from "@/api/contract";
import type { Contract } from "@/api/contract";
import dayjs from "dayjs";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.some(
    (role: string) => role === "ROLE_Admin" || role === "ROLE_Manager"
  );

  useEffect(() => {
    setLoading(true);
    listContracts()
      .then((resp) => setContracts(resp?.content))
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    exportExcel()
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

  const handleUpdateData = () => {
    setLoading(true);
    listContracts()
      .then(() => {
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
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
    setOpenUpdate(false);
    setSelectedRow(null);
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
      updateContract(payload).then(() => {
        setOpenUpdate(true);
        listContracts()
          .then((resp) => setContracts(resp?.content))
          .finally(() => {
            setLoading(false);
          });
      });
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return <Typography>Đang tải dữ liệu...</Typography>;
    }
    if (cleanData.length === 0) {
      return <Typography>Không có dữ liệu</Typography>;
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
          <Button
            variant="contained"
            color="error"
            disabled // temporary disable
            onClick={() => {
              setSelectedRow(contract);
              setOpenUpdate(true);
            }}
          >
            Sửa
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      <Typography variant="h4">Danh sách hợp đồng</Typography>
      {isAdmin ? (
        <Box mt="1rem" display="flex" gap="1rem" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "green",
            }}
            onClick={handleExportExcel}
            disabled={loadingExcel}
          >
            {loadingExcel ? (
              <CircularProgress size={20} />
            ) : (
              "Xuất báo cáo excel"
            )}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#33A1E0" }}
            onClick={handleUpdateData}
          >
            Cập nhật dữ liệu mới nhất
          </Button>
        </Box>
      ) : null}

      <Box mt="2rem">
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
              <TableCell>Sửa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
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
