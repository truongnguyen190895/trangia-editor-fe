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
import { ThongTinCanHoDialog } from "../../dialogs/thong-tin-can-ho";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { FormSection } from "@/components/common/form-section";

interface ObjectEntityProps {
  title: string;
  isUyQuyen?: boolean;
  isMotPhan?: boolean;
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title */
  numeral?: string;
}

export const ThongTinCanHo = ({
  title,
  isUyQuyen,
  isMotPhan,
  id,
  numeral,
}: ObjectEntityProps) => {
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

  const canHoRows: Array<[string, React.ReactNode]> = canHo
    ? [
        ["Số căn hộ", canHo["số_căn_hộ"]],
        ["Tên toà nhà", canHo["tên_toà_nhà"]],
        ["Địa chỉ toà nhà", canHo["địa_chỉ_toà_nhà"]],
        [
          "Diện tích sàn (m2)",
          `${canHo["diện_tích_sàn_bằng_số"]} (${canHo["diện_tích_sàn_bằng_chữ"]})`,
        ],
        ...(isMotPhan
          ? ([
              [
                "Diện tích sàn một phần (m2)",
                `${canHo["diện_tích_sàn_một_phần_bằng_số"]} (${canHo["diện_tích_sàn_một_phần_bằng_chữ"]})`,
              ],
            ] as Array<[string, React.ReactNode]>)
          : []),
        ["Cấp hạng", canHo["cấp_hạng"]],
        ["Tầng có căn hộ", canHo["tầng_có_căn_hộ"]],
        ["Kết cấu", canHo["kết_cấu"]],
        ["Hình thức sở hữu căn hộ", canHo["hình_thức_sở_hữu_căn_hộ"]],
        ["Năm hoàn thành xây dựng", canHo["năm_hoàn_thành_xây_dựng"]],
        ["Ghi chú căn hộ", canHo["ghi_chú_căn_hộ"]],
        [
          "Giá căn hộ",
          `${canHo["số_tiền"]} (${canHo["số_tiền_bằng_chữ"]})`,
        ],
        ["Loại giấy chứng nhận", canHo["loại_giấy_chứng_nhận"]],
        ["Số giấy chứng nhận", canHo["số_giấy_chứng_nhận"]],
        ["Số vào sổ cấp GCN", canHo["số_vào_sổ_cấp_giấy_chứng_nhận"]],
        ["Nơi cấp giấy chứng nhận", canHo["nơi_cấp_giấy_chứng_nhận"]],
        ["Ngày cấp giấy chứng nhận", canHo["ngày_cấp_giấy_chứng_nhận"]],
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
        ["Hình thức sử dụng", agreementObject["hình_thức_sử_dụng_đất"]],
        ["Mục đích sử dụng", agreementObject["mục_đích_sử_dụng_đất"]],
        ["Thời hạn sử dụng", agreementObject["thời_hạn_sử_dụng_đất"]],
        ["Nguồn gốc sử dụng", agreementObject["nguồn_gốc_sử_dụng_đất"]],
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
          ? Boolean(canHo)
          : Boolean(canHo) && Boolean(agreementObject)
      }
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {isUyQuyen ? (
          <Typography variant="body2" color="text.secondary">
            Chú ý: đối với HĐ uỷ quyền, không cần nhập thông tin mảnh đất
          </Typography>
        ) : null}
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle2">Thông tin căn hộ</Typography>
            <Box ml="auto">
              {canHo ? (
                <Box display="flex" gap={0.5}>
                  <IconButton
                    size="small"
                    onClick={handleOpenThongTinCanHo}
                    aria-label="Sửa thông tin căn hộ"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeleteCanHo}
                    aria-label="Xóa thông tin căn hộ"
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
                  Thêm thông tin căn hộ
                </Button>
              )}
            </Box>
          </Box>
          {canHo ? (
            <>
              {isUyQuyen ? (
                <Typography variant="body2" mb={1}>
                  Thời hạn uỷ quyền của HĐ này là: {canHo["thời_hạn"]} năm
                </Typography>
              ) : null}
              {renderRows(canHoRows)}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Chưa có thông tin căn hộ. Bấm "Thêm thông tin căn hộ" để nhập.
            </Typography>
          )}
        </Box>
        {isUyQuyen ? null : (
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
              renderRows(datRows)
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có thông tin mảnh đất. Bấm "Thêm thông tin mảnh đất" để
                nhập.
              </Typography>
            )}
          </Box>
        )}
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
    </FormSection>
  );
};
