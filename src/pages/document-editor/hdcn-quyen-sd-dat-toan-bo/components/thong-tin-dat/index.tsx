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

interface ThongTinDatProps {
  title: string;
  isTangCho?: boolean;
  isNongNghiep?: boolean;
}

export const ThongTinDat = ({ title, isTangCho = false }: ThongTinDatProps) => {
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
          disabled={Boolean(agreementObject)}
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Thêm
        </Button>

        <Box>
          <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
            <Table sx={{ border: "1px solid #BCCCDC" }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số thửa đất</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_thửa_đất"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Tờ bản đồ số</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_tờ_bản_đồ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Địa chỉ cũ</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["địa_chỉ_cũ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Địa chỉ mới</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["địa_chỉ_mới"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Loại giấy tờ</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["loại_giấy_chứng_nhận"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số giấy tờ</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_giấy_chứng_nhận"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số vào sổ cấp GCN</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["số_vào_sổ_cấp_giấy_chứng_nhận"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Nơi cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["nơi_cấp_giấy_chứng_nhận"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Ngày cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["ngày_cấp_giấy_chứng_nhận"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích (m2)</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["diện_tích"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Diện tích bằng chữ (mét vuông)
                    </Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["diện_tích_bằng_chữ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Giá tiền</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["giá_tiền"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Giá tiền bằng chữ</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["giá_tiền_bằng_chữ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Hình thức sử dụng</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["hình_thức_sử_dụng"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Mục đích và thời hạn sử dụng
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ul>
                      {agreementObject?.["mục_đích_và_thời_hạn_sử_dụng"].map(
                        (item) => (
                          <li key={item["phân_loại"]}>
                            {item["phân_loại"]} - {item["diện_tích"]} (m2) -{" "}
                            {item["thời_hạn_sử_dụng"]}
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
                  <TableCell>{agreementObject?.["nguồn_gốc_sử_dụng"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Ghi chú</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["ghi_chú"]}</TableCell>
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
