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
} from "@mui/material";
import { listContracts, exportExcel } from "@/api/contract";
import type { Contract } from "@/api/contract";
import dayjs from "dayjs";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const History = () => {
  const [open, setOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.some((role: string) => role === "ROLE_Admin");

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
      tenChuyenVien: contract.audit?.created_by_username,
      số_hợp_đồng: contract.id,
      tên_hợp_đồng: contract.name,
      tên_khách_hàng: contract.customer,
      số_tiền: contract.value,
      bản_sao: contract.copies_value,
      ghi_chú: contract.broker,
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
        <TableCell>{contract.số_tiền}</TableCell>
        <TableCell>{contract.bản_sao}</TableCell>
        <TableCell>{contract.ghi_chú}</TableCell>
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
              <TableCell>Số tiền</TableCell>
              <TableCell>Bản sao</TableCell>
              <TableCell>Ghi chú (Qh.....)</TableCell>
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
    </Box>
  );
};

export default History;
