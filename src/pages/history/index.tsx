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

const History = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
        setLoading(false);
      });
  };

  return (
    <Box>
      <Typography variant="h4">Danh sách hợp đồng</Typography>
      {isAdmin ? (
        <Box mt="1rem">
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "green",
            }}
            onClick={handleExportExcel}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Xuất báo cáo excel"}
          </Button>
        </Box>
      ) : null}

      <Box mt="2rem">
        {loading ? (
          <CircularProgress />
        ) : (
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
            <TableBody>
              {cleanData.length > 0 ? (
                cleanData.map((contract) => (
                  <TableRow>
                    <TableCell>{contract.ngay}</TableCell>
                    <TableCell>{contract.tenChuyenVien}</TableCell>
                    <TableCell>{contract.số_hợp_đồng}</TableCell>
                    <TableCell>{contract.tên_hợp_đồng}</TableCell>
                    <TableCell>{contract.tên_khách_hàng}</TableCell>
                    <TableCell>{contract.số_tiền}</TableCell>
                    <TableCell>{contract.bản_sao}</TableCell>
                    <TableCell>{contract.ghi_chú}</TableCell>
                  </TableRow>
                ))
              ) : (
                <Box py="2rem">
                  <Typography>Không có dữ liệu</Typography>
                </Box>
              )}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default History;
