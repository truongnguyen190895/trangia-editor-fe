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
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinDat } from "../../dialogs/them-thong-tin-dat";
import { FormSection } from "@/components/common/form-section";

interface ThongTinDatProps {
  title: string;
  isTangCho?: boolean;
  isNongNghiep?: boolean;
  isMotPhan?: boolean;
  isCoCongVan?: boolean;
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title */
  numeral?: string;
}

export const ThongTinDat = ({
  title,
  isTangCho = false,
  isMotPhan = false,
  isCoCongVan = false,
  id,
  numeral,
}: ThongTinDatProps) => {
  const { agreementObject, deleteAgreementObject } = useHdcnQuyenSdDatContext();
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const rows: Array<[string, React.ReactNode]> = agreementObject
    ? [
        ["Số thửa đất", agreementObject["số_thửa_đất"]],
        ["Tờ bản đồ số", agreementObject["số_tờ_bản_đồ"]],
        ["Địa chỉ cũ", agreementObject["địa_chỉ_cũ"]],
        ["Địa chỉ mới", agreementObject["địa_chỉ_mới"]],
        ["Loại giấy tờ", agreementObject["loại_giấy_chứng_nhận"]],
        ["Số giấy tờ", agreementObject["số_giấy_chứng_nhận"]],
        ["Số vào sổ cấp GCN", agreementObject["số_vào_sổ_cấp_giấy_chứng_nhận"]],
        ["Nơi cấp giấy chứng nhận", agreementObject["nơi_cấp_giấy_chứng_nhận"]],
        ["Ngày cấp giấy chứng nhận", agreementObject["ngày_cấp_giấy_chứng_nhận"]],
        ["Diện tích (m2)", agreementObject["diện_tích"]],
        ["Diện tích bằng chữ (mét vuông)", agreementObject["diện_tích_bằng_chữ"]],
        ["Giá tiền", agreementObject["giá_tiền"]],
        ["Giá tiền bằng chữ", agreementObject["giá_tiền_bằng_chữ"]],
        ["Hình thức sử dụng", agreementObject["hình_thức_sử_dụng"]],
        [
          "Mục đích và thời hạn sử dụng",
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {agreementObject["mục_đích_và_thời_hạn_sử_dụng"].map((item) => (
              <li key={item["phân_loại"]}>
                {item["phân_loại"]} - {item["diện_tích"]} (m2) -{" "}
                {item["thời_hạn_sử_dụng"]}
              </li>
            ))}
          </ul>,
        ],
        ["Nguồn gốc sử dụng", agreementObject["nguồn_gốc_sử_dụng"]],
        ["Ghi chú", agreementObject["ghi_chú"]],
      ]
    : [];

  return (
    <FormSection
      id={id}
      numeral={numeral}
      title={title}
      complete={Boolean(agreementObject)}
      action={
        agreementObject ? (
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={handleOpenModal}
              aria-label="Sửa thông tin đất"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteAgreementObject()}
              aria-label="Xóa thông tin đất"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
          >
            Thêm thông tin đất
          </Button>
        )
      }
    >
      {agreementObject ? (
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
      ) : (
        <Typography variant="body2" color="text.secondary">
          Chưa có thông tin thửa đất. Bấm "Thêm thông tin đất" để nhập.
        </Typography>
      )}
      {open ? (
        <ThemThongTinDat
          open={open}
          handleClose={() => setOpen(false)}
          isTangCho={isTangCho}
          isMotPhan={isMotPhan}
          isCoCongVan={isCoCongVan}
        />
      ) : null}
    </FormSection>
  );
};
