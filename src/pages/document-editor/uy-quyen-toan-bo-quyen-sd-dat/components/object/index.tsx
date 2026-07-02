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

interface ObjectEntityProps {
  title: string;
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title */
  numeral?: string;
}

export const ObjectEntity = ({ title, id, numeral }: ObjectEntityProps) => {
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
        ["Thời hạn uỷ quyền (năm)", agreementObject["thời_hạn"]],
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
              aria-label="Sửa đối tượng uỷ quyền"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteAgreementObject()}
              aria-label="Xóa đối tượng uỷ quyền"
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
          Chưa có thông tin đối tượng uỷ quyền. Bấm "Thêm thông tin đất" để
          nhập.
        </Typography>
      )}
      {open ? (
        <ThemThongTinDat open={open} handleClose={() => setOpen(false)} />
      ) : null}
    </FormSection>
  );
};
