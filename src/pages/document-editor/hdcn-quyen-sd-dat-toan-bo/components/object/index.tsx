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
  const { agreementObject, deleteAgreementObject } = useHdcnQuyenSdDatContext();
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleEditObject = () => {
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
        {agreementObject !== null ? (
          <Box>
            <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
              <Table sx={{ border: "1px solid #BCCCDC" }}>
                <TableBody>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số thửa đất</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số thửa đất"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Tờ bản đồ số</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["tờ bản đồ"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Địa chỉ cũ</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["địa chỉ cũ"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Địa chỉ mới</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["địa chỉ mới"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Loại giấy tờ</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["loại giấy chứng nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số giấy tờ</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["số giấy chứng nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số vào sổ cấp GCN</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["số vào sổ cấp giấy chứng nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Nơi cấp giấy chứng nhận
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["nơi cấp giấy chứng nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Ngày cấp giấy chứng nhận
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(
                        agreementObject["ngày cấp giấy chứng nhận"]
                      ).format("DD/MM/YYYY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Diện tích (m2)</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["diện tích"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Diện tích bằng chữ (mét vuông)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["diện tích bằng chữ"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Giá tiền</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["giá tiền"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Giá tiền bằng chữ</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["giá tiền bằng chữ"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Hình thức sử dụng</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["hình thức sử dụng"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Mục đích và thời hạn sử dụng
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <ul>
                        {agreementObject["mục đích và thời hạn sử dụng"].map(
                          (item) => (
                            <li key={item["phân loại"]}>
                              {item["phân loại"]} - {item["diện tích"]} (m2) -{" "}
                              {item["thời hạn sử dụng"]}
                            </li>
                          )
                        )}
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Nguồn gốc sử dụng</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["nguồn gốc sử dụng"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Ghi chú</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["ghi chú"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Thao tác</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleEditObject()}
                        />
                        <DeleteIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => deleteAgreementObject()}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
      </Box>
      {open ? (
        <ThemThongTinDat open={open} handleClose={() => setOpen(false)} />
      ) : null}
    </Box>
  );
};
