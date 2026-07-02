import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";
import { ThongTinTaiSanDialog } from "../../dialogs/thong-tin-tai-san";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";
import { FormSection } from "@/components/common/form-section";

interface ObjectEntityProps {
  title: string;
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title */
  numeral?: string;
}

export const ObjectEntity = ({ title, id, numeral }: ObjectEntityProps) => {
  const { agreementObject, taiSan, deleteAgreementObject, deleteTaiSan } =
    useHDMBTaiSanContext();
  const [open, setOpen] = useState(false);
  const [openThongTinTaiSan, setOpenThongTinTaiSan] = useState(false);

  const handleOpenThongTinDat = () => {
    setOpen(true);
  };

  const handleOpenThongTinTaiSan = () => {
    setOpenThongTinTaiSan(true);
  };

  const handleDeleteTaiSan = () => {
    deleteTaiSan();
  };

  const taiSanRows: Array<[string, React.ReactNode]> = taiSan
    ? [
        ["Tên tài sản", taiSan["tên_tài_sản"]],
        ["Diện tích sử dụng", `${taiSan["diện_tích_sử_dụng"]} m2`],
        ["Hình thức sở hữu", taiSan["hình_thức_sở_hữu"]],
        ["Giá trị chuyển nhượng, mua bán", taiSan["số_tiền"]],
        ["Bằng chữ", taiSan["số_tiền_bằng_chữ"]],
      ]
    : [];

  const datRows: Array<[string, React.ReactNode]> = agreementObject
    ? [
        ["Diện tích (m2)", agreementObject["diện_tích_đất_bằng_số"]],
        [
          "Diện tích bằng chữ (mét vuông)",
          agreementObject["diện_tích_đất_bằng_chữ"],
        ],
        ["Hình thức sử dụng", agreementObject["hình_thức_sử_dụng_đất"]],
        ["Mục đích sử dụng", agreementObject["mục_đích_sử_dụng_đất"]],
        ["Thời hạn sử dụng", agreementObject["thời_hạn_sử_dụng_đất"]],
        ["Nguồn gốc sử dụng", agreementObject["nguồn_gốc_sử_dụng_đất"]],
        ["Địa chỉ", agreementObject["địa_chỉ"]],
        ["Loại giấy chứng nhận", agreementObject["loại_gcn"]],
        ["Số giấy chứng nhân", agreementObject["số_gcn"]],
        ["Số vào sổ cấp giấy chứng nhận", agreementObject["số_vào_sổ_cấp_gcn"]],
        ["Nơi cấp giấy chứng nhận", agreementObject["nơi_cấp_gcn"]],
        ["Ngày cấp giấy chứng nhận", agreementObject["ngày_cấp_gcn"]],
      ]
    : [];

  const rowTable = (rows: Array<[string, React.ReactNode]>) => (
    <Table size="small" sx={{ mt: 1 }}>
      <TableBody>
        {rows.map(([label, value]) => (
          <TableRow key={label}>
            <TableCell
              component="th"
              sx={{ width: "260px", color: "text.secondary" }}
            >
              {label}
            </TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <FormSection
      id={id}
      numeral={numeral}
      title={title}
      complete={Boolean(taiSan) && Boolean(agreementObject)}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Thông tin tài sản gắn liền với đất
            </Typography>
            {taiSan ? (
              <Box display="flex" gap={0.5}>
                <IconButton
                  size="small"
                  onClick={handleOpenThongTinTaiSan}
                  aria-label="Sửa thông tin tài sản"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleDeleteTaiSan}
                  aria-label="Xóa thông tin tài sản"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenThongTinTaiSan}
              >
                Thêm thông tin tài sản
              </Button>
            )}
          </Box>
          {taiSan ? (
            rowTable(taiSanRows)
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Chưa có thông tin tài sản. Bấm "Thêm thông tin tài sản" để nhập.
            </Typography>
          )}
        </Box>
        <Divider />
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Thông tin mảnh đất</Typography>
            {agreementObject ? (
              <Box display="flex" gap={0.5}>
                <IconButton
                  size="small"
                  onClick={handleOpenThongTinDat}
                  aria-label="Sửa thông tin mảnh đất"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteAgreementObject()}
                  aria-label="Xóa thông tin mảnh đất"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenThongTinDat}
              >
                Thêm thông tin mảnh đất
              </Button>
            )}
          </Box>
          {agreementObject ? (
            rowTable(datRows)
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Chưa có thông tin mảnh đất. Bấm "Thêm thông tin mảnh đất" để
              nhập.
            </Typography>
          )}
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
    </FormSection>
  );
};
