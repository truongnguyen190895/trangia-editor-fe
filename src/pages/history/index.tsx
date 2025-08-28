import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import { listContracts } from "@/api/contract";
import type { Contract } from "@/api/contract";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";

const History = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    listContracts().then((resp) => setContracts(resp?.content));
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

  return (
    <Box>
      <Typography variant="h4">Danh sách hợp đồng</Typography>
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
          <TableBody>
            {cleanData.map((contract) => (
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
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default History;
