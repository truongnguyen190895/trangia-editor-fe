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
import { useHDMBXeContext } from "@/context/hdmb-xe";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinXe } from "../../dialogs/them-thong-tin-xe";

interface ObjectEntityProps {
  title: string;
  isXeMay?: boolean;
}

export const ObjectEntity = ({ title, isXeMay }: ObjectEntityProps) => {
  const { agreementObject, deleteAgreementObject } = useHDMBXeContext();
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
                      <Typography variant="body1">Nhãn hiệu</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["nhãn_hiệu"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Màu sơn</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["màu_sơn"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Loại xe</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["loại_xe"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số máy</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_máy"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số loại</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_loại"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số khung</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_khung"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Biển số</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["biển_số"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số đăng ký</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_đăng_ký"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Nơi cấp</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["nơi_cấp"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Ngày cấp giấy chứng nhận
                      </Typography>
                    </TableCell>
                    <TableCell>{agreementObject["ngày_đăng_ký"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">
                        Ngày đăng ký lần đầu
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agreementObject["ngày_đăng_ký_lần_đầu"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Ngày đăng ký</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["ngày_đăng_ký"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số tiền</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_tiền"]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">
                      <Typography variant="body1">Số tiền bằng chữ</Typography>
                    </TableCell>
                    <TableCell>{agreementObject["số_tiền_bằng_chữ"]}</TableCell>
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
        <ThemThongTinXe
          open={open}
          isXeMay={isXeMay}
          handleClose={() => setOpen(false)}
        />
      ) : null}
    </Box>
  );
};
