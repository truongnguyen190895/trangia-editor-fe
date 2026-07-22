import { useState } from "react";
import {
  Box,
  Button,
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
import { ThongTinNhaDatDialog } from "../../dialogs/thong-tin-nha-dat";
import { useHDMBNhaDatContext } from "@/context/hdmb-nha-dat";
import { FormSection } from "@/components/common/form-section";

interface DoiTuongHopDongProps {
  title: string;
  isUyQuyen?: boolean;
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title */
  numeral?: string;
}

export const DoiTuongHopDong = ({
  title,
  isUyQuyen,
  id,
  numeral,
}: DoiTuongHopDongProps) => {
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

  const nhaRows: Array<[string, React.ReactNode]> = nhaDat
    ? [
        ["Diện tích xây dựng (m2)", nhaDat["diện_tích_xây_dựng"]],
        ["Diện tích sàn (m2)", nhaDat["diện_tích_sàn"]],
        ["Số tầng", nhaDat["số_tầng"]],
        ["Kết cấu", nhaDat["kết_cấu"]],
        ["Cấp hạng", nhaDat["cấp_hạng"]],
        ["Năm hoàn thành xây dựng", nhaDat["năm_hoàn_thành_xây_dựng"]],
        ["Số tiền", `${nhaDat["số_tiền"]} (${nhaDat["số_tiền_bằng_chữ"]})`],
        ["Hình thức sở hữu", nhaDat["hình_thức_sở_hữu"]],
        ["Loại nhà ở", nhaDat["loại_nhà_ở"]],
        ["Ghi chú", nhaDat["ghi_chú"]],
      ]
    : [];

  const datRows: Array<[string, React.ReactNode]> = agreementObject
    ? [
        ["Số thửa đất", agreementObject["số_thửa_đất"]],
        ["Tờ bản đồ số", agreementObject["số_tờ_bản_đồ"]],
        ["Diện tích (m2)", agreementObject["diện_tích_đất_bằng_số"]],
        [
          "Diện tích bằng chữ (mét vuông)",
          agreementObject["diện_tích_đất_bằng_chữ"],
        ],
        ["Hình thức sử dụng", agreementObject["hình_thức_sở_hữu_đất"]],
        ["Mục đích sử dụng", agreementObject["mục_đích_sở_hữu_đất"]],
        ["Thời hạn sử dụng", agreementObject["thời_hạn_sử_dụng_đất"]],
        ["Nguồn gốc sử dụng", agreementObject["nguồn_gốc_sử_dụng_đất"]],
        ["Địa chỉ nhà đất", agreementObject["địa_chỉ_nhà_đất"]],
        ["Loại giấy chứng nhận", agreementObject["loại_giấy_chứng_nhận"]],
        ["Số giấy chứng nhân", agreementObject["số_giấy_chứng_nhận"]],
        ["Số vào sổ cấp giấy chứng nhận", agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"]],
        ["Nơi cấp giấy chứng nhận", agreementObject["nơi_cấp_giấy_chứng_nhận"]],
        ["Ngày cấp giấy chứng nhận", agreementObject["ngày_cấp_giấy_chứng_nhận"]],
      ]
    : [];

  const renderRows = (rows: Array<[string, React.ReactNode]>) => (
    <Table size="small">
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
      complete={
        isUyQuyen
          ? Boolean(agreementObject)
          : Boolean(nhaDat) && Boolean(agreementObject)
      }
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {isUyQuyen ? (
          <Typography variant="body2" color="text.secondary">
            Note: HĐ uỷ quyền không cần nhập thông tin nhà đất
          </Typography>
        ) : null}
        {!isUyQuyen ? (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="subtitle2">Thông tin nhà ở</Typography>
              <Box ml="auto">
                {nhaDat ? (
                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      onClick={handleOpenThongTinCanHo}
                      aria-label="Sửa thông tin nhà ở"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={handleDeleteCanHo}
                      aria-label="Xóa thông tin nhà ở"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpenThongTinCanHo}
                  >
                    Thêm thông tin nhà ở
                  </Button>
                )}
              </Box>
            </Box>
            {nhaDat ? (
              renderRows(nhaRows)
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có thông tin nhà ở. Bấm "Thêm thông tin nhà ở" để nhập.
              </Typography>
            )}
          </Box>
        ) : null}
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle2">Thông tin mảnh đất</Typography>
            <Box ml="auto">
              {agreementObject ? (
                <Box display="flex" gap={0.5}>
                  <IconButton
                    size="small"
                    onClick={handleEditObject}
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
          </Box>
          {agreementObject ? (
            <>
              {isUyQuyen ? (
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Thời hạn uỷ quyền: {agreementObject["thời_hạn"]} năm
                </Typography>
              ) : null}
              {renderRows(datRows)}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Chưa có thông tin mảnh đất. Bấm "Thêm thông tin mảnh đất" để
              nhập.
            </Typography>
          )}
        </Box>
      </Box>
      {open ? (
        <ThemThongTinDat
          open={open}
          isUyQuyen={isUyQuyen}
          handleClose={() => setOpen(false)}
        />
      ) : null}
      {openCanHo ? (
        <ThongTinNhaDatDialog
          open={openCanHo}
          isUyQuyen={isUyQuyen}
          handleClose={() => setOpenCanHo(false)}
        />
      ) : null}
    </FormSection>
  );
};
