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
import { ThongTinTaiSanDialog } from "../../dialogs/thong-tin-tai-san";
import { useHDCNDatVaTaiSanGanLienVoiDatToanBoContext } from "@/context/hdcn-dat-va-tai-san-glvd";

interface ObjectEntityProps {
  title: string;
  isMotPhan?: boolean;
  scope?: "partial" | "full";
}

export const ObjectEntity = ({
  title,
  isMotPhan = false,
  scope = "full",
}: ObjectEntityProps) => {
  const { agreementObject, taiSan, deleteAgreementObject, deleteTaiSan } =
    useHDCNDatVaTaiSanGanLienVoiDatToanBoContext();
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
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="10px" >
          <Box>
            <Typography variant="h4" color="#B12C00" my="1rem">
              Thông tin tài sản
            </Typography>
            <Box
              mb="20px"
              border="1px solid #BCCCDC"
              borderRadius="5px"
              padding="10px"
            >
              {taiSan?.["thông_tin_tài_sản"].split(";").map((item, index) => (
                <Typography key={index}>Tên tài sản: {item}</Typography>
              ))}
              <Typography>
                Diện tích xây dựng: {taiSan?.["diện_tích_xây_dựng"]} m2
              </Typography>
              <Typography
                variant="body1"
                fontSize="1.3rem"
                fontWeight="600"
                mt="20px"
              >
                Giá trị hợp đồng: {taiSan?.["số_tiền"]}
              </Typography>
            </Box>
            {taiSan ? (
              <Box display="flex" gap="10px">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenThongTinTaiSan}
                >
                  Sửa
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteTaiSan}
                >
                  Xoá
                </Button>
              </Box>
            ) : null}
          </Box>
          <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
            <Typography variant="h4" color="#B12C00" my="1rem">
              Thông tin mảnh đất
            </Typography>
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
                    {agreementObject?.["hình_thức_sở_hữu_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Mục đích sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["mục_đích_sở_hữu_đất"]}
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
                    <Typography variant="body1">Địa chỉ nhà đất</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["địa_chỉ_nhà_đất"]}</TableCell>
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
          </TableContainer>
        </Box>
      </Box>
      {open ? (
        <ThemThongTinDat
          open={open}
          handleClose={() => setOpen(false)}
          isMotPhan={isMotPhan}
          scope={scope}
        />
      ) : null}
      {openThongTinTaiSan ? (
        <ThongTinTaiSanDialog
          open={openThongTinTaiSan}
          handleClose={() => setOpenThongTinTaiSan(false)}
          isMotPhan={isMotPhan}
          scope={scope}
        />
      ) : null}
    </Box>
  );
};
