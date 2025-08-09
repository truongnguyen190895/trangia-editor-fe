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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";
import { ThongTinCanHoDialog } from "../../dialogs/thong-tin-can-ho";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";

interface ObjectEntityProps {
  title: string;
  isUyQuyen?: boolean;
}

export const ThongTinCanHo = ({ title, isUyQuyen }: ObjectEntityProps) => {
  const { agreementObject, canHo, deleteAgreementObject, deleteCanHo } =
    useHDMBCanHoContext();
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
    deleteCanHo();
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
            disabled={Boolean(canHo)}
            onClick={handleOpenThongTinCanHo}
          >
            Thêm thông tin căn hộ
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={Boolean(agreementObject) || isUyQuyen}
            onClick={handleOpenThongTinDat}
          >
            Thêm thông tin mảnh đất
          </Button>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 1fr" py="2rem">
          <Typography
            variant="h4"
            color="#B12C00"
            visibility={Boolean(canHo) ? "hidden" : "visible"}
          >
            Chưa có thông tin căn hộ
          </Typography>
          {isUyQuyen ? null : (
            <Typography
              variant="h4"
              color="#B12C00"
              visibility={Boolean(agreementObject) ? "hidden" : "visible"}
            >
              Chưa có thông tin mảnh đất
            </Typography>
          )}
        </Box>
        {isUyQuyen ? (
          <Typography variant="body1" color="error">
            Chú ý: đối với HĐ uỷ quyền, không cần nhập thông tin mảnh đất
          </Typography>
        ) : null}

        {isUyQuyen ? (
          <Box mt="20px">
            <Typography variant="body1" fontSize="1.5rem">
              Thời hạn uỷ quyền của HĐ này là: {canHo?.["thời_hạn"]} năm
            </Typography>
          </Box>
        ) : null}

        <Box>
          <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
            <Table sx={{ border: "1px solid #BCCCDC" }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Số căn hộ</Typography>
                  </TableCell>
                  <TableCell>{canHo?.["số_căn_hộ"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Số thửa đất</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_thửa_đất"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Tên toà nhà</Typography>
                  </TableCell>
                  <TableCell>{canHo?.["tên_toà_nhà"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Tờ bản đồ số</Typography>
                  </TableCell>
                  <TableCell>{agreementObject?.["số_tờ_bản_đồ"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Địa chỉ toà nhà</Typography>
                  </TableCell>
                  <TableCell>{canHo?.["địa_chỉ_toà_nhà"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích (m2)</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["diện_tích_đất_bằng_số"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Diện tích sàn (m2)</Typography>
                  </TableCell>
                  <TableCell>
                    {canHo?.["diện_tích_sàn_bằng_số"]} (
                    {canHo?.["diện_tích_sàn_bằng_chữ"]})
                  </TableCell>
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
                  <TableCell>{canHo?.["cấp_hạng"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Hình thức sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["hình_thức_sở_hữu_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Tầng có căn hộ</Typography>
                  </TableCell>
                  <TableCell>{canHo?.["tầng_có_căn_hộ"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Mục đích sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["mục_đích_sở_hữu_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Kết cấu</Typography>
                  </TableCell>
                  <TableCell>{canHo?.["kết_cấu"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Thời hạn sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["thời_hạn_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Hình thức sở hữu căn hộ
                    </Typography>
                  </TableCell>
                  <TableCell>{canHo?.["hình_thức_sở_hữu_căn_hộ"]}</TableCell>
                  <TableCell component="th">
                    <Typography variant="body1">Nguồn gốc sử dụng</Typography>
                  </TableCell>
                  <TableCell>
                    {agreementObject?.["nguồn_gốc_sử_dụng_đất"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">
                      Năm hoàn thành xây dựng
                    </Typography>
                  </TableCell>
                  <TableCell>{canHo?.["năm_hoàn_thành_xây_dựng"]}</TableCell>
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
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Ghi chú căn hộ</Typography>
                  </TableCell>
                  <TableCell>{canHo?.["ghi_chú_căn_hộ"]}</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Giá căn hộ</Typography>
                  </TableCell>
                  <TableCell>
                    {canHo?.["giá_căn_hộ_bằng_số"]} (
                    {canHo?.["giá_căn_hộ_bằng_chữ"]})
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell component="th">
                    <Typography variant="body1">Giấy chứng nhận</Typography>
                  </TableCell>
                  <TableCell>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Loại"
                          secondary={canHo?.["loại_gcn"]}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Số"
                          secondary={canHo?.["số_gcn"]}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Số vào sổ"
                          secondary={canHo?.["số_vào_sổ_cấp_gcn"]}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Nơi cấp"
                          secondary={canHo?.["nơi_cấp_gcn"]}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Ngày cấp"
                          secondary={canHo?.["ngày_cấp_gcn"]}
                        />
                      </ListItem>
                    </List>
                  </TableCell>
                  <TableCell />
                  <TableCell />
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
                  <TableCell />
                  <TableCell />
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
        <ThongTinCanHoDialog
          open={openCanHo}
          isUyQuyen={isUyQuyen}
          handleClose={() => setOpenCanHo(false)}
        />
      ) : null}
    </Box>
  );
};
