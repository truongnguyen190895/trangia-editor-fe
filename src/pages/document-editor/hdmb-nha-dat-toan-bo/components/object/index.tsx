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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";
import { ThongTinNhaDatDialog } from "../../dialogs/thong-tin-nha-dat";
import { useHDMBNhaDatContext } from "@/context/hdmb-nha-dat";

interface ObjectEntityProps {
  title: string;
}

export const ObjectEntity = ({ title }: ObjectEntityProps) => {
  const { agreementObject, nhaDat, deleteAgreementObject, deleteNhaDat } =
    useHDMBNhaDatContext();
  const [open, setOpen] = useState(false);
  const [openCanHo, setOpenCanHo] = useState(false);

  const handleOpenThongTinDat = () => {
    setOpen(true);
  };

  const handleEditObject = () => {
    handleOpenThongTinDat();
  };

  const handleOpenThongTinCanHo = () => {
    setOpenCanHo(true);
  };

  const handleDeleteCanHo = () => {
    deleteNhaDat();
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
        <Box display="flex" gap="10px" marginBottom="10px">
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            disabled={Boolean(nhaDat)}
            onClick={handleOpenThongTinCanHo}
          >
            Thêm thông tin nhà ở
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={Boolean(agreementObject)}
            onClick={handleOpenThongTinDat}
          >
            Thêm thông tin mảnh đất
          </Button>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 1fr" py="2rem">
          <Typography
            variant="h4"
            color="#B12C00"
            visibility={Boolean(nhaDat) ? "hidden" : "visible"}
          >
            Chưa có thông nhà ở
          </Typography>
          <Typography
            variant="h4"
            color="#B12C00"
            visibility={Boolean(agreementObject) ? "hidden" : "visible"}
          >
            Chưa có thông tin mảnh đất
          </Typography>
        </Box>
        <Box>
          <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
            <Table sx={{ border: "1px solid #BCCCDC" }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Diện tích xây dựng (m2)
                    </Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["diện_tích_xây_dựng"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Số thửa đất</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_thửa_đất"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích sàn (m2)</Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["diện_tích_sàn"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Tờ bản đồ số</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_tờ_bản_đồ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số tầng</Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["số_tầng"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích (m2)</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["diện_tích_đất_bằng_số"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Kết cấu</Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["kết_cấu"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Diện tích bằng chữ (mét vuông)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["diện_tích_đất_bằng_chữ"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Cấp hạng</Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["cấp_hạng"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Hình thức sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["hình_thức_sở_hữu_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Năm hoàn thành xây dựng
                    </Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["năm_hoàn_thành_xây_dựng"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Mục đích sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["mục_đích_sở_hữu_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số tiền</Typography>
                  </TableCell>
                  <TableCell>
                    {nhaDat?.["số_tiền"]} ({nhaDat?.["số_tiền_bằng_chữ"]})
                  </TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Thời hạn sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["thời_hạn_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Ghi chú</Typography>
                  </TableCell>
                  <TableCell>{nhaDat?.["ghi_chú"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Nguồn gốc sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["nguồn_gốc_sử_dụng_đất"]}
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
                        onClick={() => handleOpenThongTinCanHo()}
                      />
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDeleteCanHo()}
                      />
                    </Box>
                  </TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Địa chỉ nhà đất</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["địa_chỉ_nhà_đất"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell component="th">
                    <Typography variant="body1">
                      Loại giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["loại_gcn"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell component="th">
                    <Typography variant="body1">Số giấy chứng nhân</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_gcn"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell component="th">
                    <Typography variant="body1">
                      Số vào sổ cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["số_vào_sổ_cấp_gcn"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell component="th">
                    <Typography variant="body1">
                      Nơi cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["nơi_cấp_gcn"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell component="th">
                    <Typography variant="body1">
                      Ngày cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["ngày_cấp_gcn"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
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
        <ThemThongTinDat open={open} handleClose={() => setOpen(false)} />
      ) : null}
      {openCanHo ? (
        <ThongTinNhaDatDialog
          open={openCanHo}
          handleClose={() => setOpenCanHo(false)}
        />
      ) : null}
    </Box>
  );
};
