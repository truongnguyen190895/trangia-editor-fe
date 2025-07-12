import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";

interface ObjectEntityProps {
  title: string;
}

export const ObjectEntity = ({ title }: ObjectEntityProps) => {
  const { agreementObjects, deleteAgreementObject, setEditObjectIndex } =
    useHdcnQuyenSdDatContext();
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleEditObject = (index: number) => {
    setEditObjectIndex(index);
    handleOpenModal();
  };

  return (
    <Box border="1px solid #BCCCDC" borderRadius="5px">
      <Box
        height="80px"
        bgcolor="#3D90D7"
        paddingX="10px"
        display="flex"
        alignItems="center"
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box padding="10px">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Thêm
        </Button>
        {agreementObjects.length > 0 ? (
          <Box>
            {agreementObjects.map((object, index) => (
              <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
                <Table sx={{ border: "1px solid #BCCCDC" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Số thửa đất</Typography>
                      </TableCell>
                      <TableCell>{object.so_thua_dat}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Tờ bản đồ số</Typography>
                      </TableCell>
                      <TableCell>{object.to_ban_do_so}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Địa chỉ</Typography>
                      </TableCell>
                      <TableCell>{object.dia_chi}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Loại giấy tờ</Typography>
                      </TableCell>
                      <TableCell>{object.loai_giay_to}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Số giấy tờ</Typography>
                      </TableCell>
                      <TableCell>{object.so_giay_to}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Số vào sổ cấp GCN
                        </Typography>
                      </TableCell>
                      <TableCell>{object.so_vao_so_cap_gcn}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Nơi cấp giấy chứng nhận
                        </Typography>
                      </TableCell>
                      <TableCell>{object.noi_cap_giay_chung_nhan}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Ngày cấp giấy chứng nhận
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {dayjs(object.ngay_cap_giay_chung_nhan).format(
                          "DD/MM/YYYY"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Diện tích (m2)</Typography>
                      </TableCell>
                      <TableCell>{object.dien_tich}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Hình thức sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object.hinh_thuc_su_dung}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Mục đích sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object.muc_dich_su_dung}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Thời hạn sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object.thoi_han_su_dung}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Nguồn gốc sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object.nguon_goc_su_dung}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Ghi chú</Typography>
                      </TableCell>
                      <TableCell>{object.ghi_chu}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Thao tác</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <EditIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleEditObject(index)}
                          />
                          <DeleteIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => deleteAgreementObject(index)}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
          </Box>
        ) : null}
      </Box>
      {open ? (
        <ThemThongTinDat open={open} handleClose={() => setOpen(false)} />
      ) : null}
    </Box>
  );
};
