import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";
import { ThongTinTaiSanDialog } from "../../dialogs/thong-tin-tai-san";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";

interface ObjectEntityProps {
  title: string;
}

export const ObjectEntity = ({ title }: ObjectEntityProps) => {
  const { agreementObject, taiSan, deleteAgreementObject, deleteTaiSan } =
    useHDMBTaiSanContext();
  const [open, setOpen] = useState(false);
  const [openThongTinTaiSan, setOpenThongTinTaiSan] = useState(false);

  const handleOpenThongTinDat = () => {
    setOpen(true);
  };

  const handleEditObject = () => {
    handleOpenThongTinDat();
  };

  const handleOpenThongTinTaiSan = () => {
    setOpenThongTinTaiSan(true);
  };

  const handleDeleteTaiSan = () => {
    deleteTaiSan();
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
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap="10px"
          marginBottom="10px"
        >
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            disabled={Boolean(taiSan)}
            onClick={handleOpenThongTinTaiSan}
          >
            Thêm thông tin tài sản gắn liền với đất
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
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="10px" py="1rem">
          <Box>
            <Typography variant="h4" color="#B12C00">
              Thông tin tài sản
            </Typography>
            <Table sx={{ border: "1px solid #BCCCDC", mt: "1rem" }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Tên tài sản</Typography>
                  </TableCell>
                  <TableCell>{taiSan?.["tên_tài_sản"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích sử dụng</Typography>
                  </TableCell>
                  <TableCell>{taiSan?.["diện_tích_sử_dụng"]} m2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Hình thức sở hữu</Typography>
                  </TableCell>
                  <TableCell>{taiSan?.["hình_thức_sở_hữu"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Giá trị chuyển nhượng, mua bán
                    </Typography>
                  </TableCell>
                  <TableCell>{taiSan?.["số_tiền"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Bằng chữ</Typography>
                  </TableCell>
                  <TableCell>{taiSan?.["số_tiền_bằng_chữ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Thao tác</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={handleOpenThongTinTaiSan}
                      />
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={handleDeleteTaiSan}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box>
            <Typography variant="h4" color="#B12C00">
              Thông tin mảnh đất
            </Typography>
            <Table sx={{ border: "1px solid #BCCCDC", mt: "1rem" }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích (m2)</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["diện_tích_đất_bằng_số"]}
                  </TableCell>
                </TableRow>
                <TableRow>
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
                    <Typography variant="body1">Hình thức sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["hình_thức_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Mục đích sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["mục_đích_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Thời hạn sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["thời_hạn_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Nguồn gốc sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["nguồn_gốc_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Địa chỉ</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["địa_chỉ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Loại giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["loại_gcn"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số giấy chứng nhân</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_gcn"]}</TableCell>
                </TableRow>
                <TableRow>
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
                  <TableCell component="th">
                    <Typography variant="body1">
                      Nơi cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["nơi_cấp_gcn"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Ngày cấp giấy chứng nhận
                    </Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["ngày_cấp_gcn"]}</TableCell>
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
          </Box>
        </Box>
      </Box>
      {open ? (
        <ThemThongTinDat open={open} handleClose={() => setOpen(false)} />
      ) : null}
      {openThongTinTaiSan ? (
        <ThongTinTaiSanDialog
          open={openThongTinTaiSan}
          handleClose={() => setOpenThongTinTaiSan(false)}
        />
      ) : null}
    </Box>
  );
};
