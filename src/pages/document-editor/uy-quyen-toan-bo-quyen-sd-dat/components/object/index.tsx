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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";

interface ObjectEntityProps {
  title: string;
  isTangCho?: boolean;
  isNongNghiep?: boolean;
}

export const ObjectEntity = ({
  title,
  isTangCho = false,
}: ObjectEntityProps) => {
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
                    <TableCell>{agreementObject["số_thửa_đất"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Tờ bản đồ số</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_tờ_bản_đồ"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Địa chỉ cũ</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["địa_chỉ_cũ"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Địa chỉ mới</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["địa_chỉ_mới"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Loại giấy tờ</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["loại_giấy_chứng_nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số giấy tờ</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["số_giấy_chứng_nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số vào sổ cấp GCN</Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Nơi cấp giấy chứng nhận
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["nơi_cấp_giấy_chứng_nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Ngày cấp giấy chứng nhận
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["ngày_cấp_giấy_chứng_nhận"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Thời hạn uỷ quyền (năm)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["thời_hạn"]}
                    </TableCell>
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
        <ThemThongTinDat
          open={open}
          handleClose={() => setOpen(false)}
          isTangCho={isTangCho}
        />
      ) : null}
    </Box>
  );
};
