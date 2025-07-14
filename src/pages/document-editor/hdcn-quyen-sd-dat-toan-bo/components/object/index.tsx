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
                      <TableCell>{object["số thửa đất"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Tờ bản đồ số</Typography>
                      </TableCell>
                      <TableCell>{object["tờ bản đồ"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Địa chỉ</Typography>
                      </TableCell>
                      <TableCell>{object["địa chỉ cũ"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Loại giấy tờ</Typography>
                      </TableCell>
                      <TableCell>{object["loại giấy chứng nhận"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Số giấy tờ</Typography>
                      </TableCell>
                      <TableCell>{object["số giấy chứng nhận"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Số vào sổ cấp GCN
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {object["số vào sổ cấp giấy chứng nhận"]}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Nơi cấp giấy chứng nhận
                        </Typography>
                      </TableCell>
                      <TableCell>{object["nơi cấp giấy chứng nhận"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Ngày cấp giấy chứng nhận
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {dayjs(object["ngày cấp giấy chứng nhận"]).format(
                          "DD/MM/YYYY"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Diện tích (m2)</Typography>
                      </TableCell>
                      <TableCell>{object["diện tích"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Hình thức sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object["hình thức sử dụng"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Mục đích sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object["mục đích sử dụng"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Thời hạn sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object["thời hạn sử dụng"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">
                          Nguồn gốc sử dụng
                        </Typography>
                      </TableCell>
                      <TableCell>{object["nguồn gốc sử dụng"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">
                        <Typography variant="body1">Ghi chú</Typography>
                      </TableCell>
                      <TableCell>{object["ghi chú"]}</TableCell>
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
