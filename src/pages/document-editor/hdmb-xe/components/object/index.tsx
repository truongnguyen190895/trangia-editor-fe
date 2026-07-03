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
import { useHDMBXeContext } from "@/context/hdmb-xe";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemThongTinXe } from "../../dialogs/them-thong-tin-xe";
import { FormSection } from "@/components/common/form-section";

interface ObjectEntityProps {
  title: string;
  isXeMay?: boolean;
  isDauGia?: boolean;
  isUyQuyen?: boolean;
  /** Anchor id for SectionNav */
  id?: string;
  /** Roman numeral shown before the title */
  numeral?: string;
}

export const ObjectEntity = ({
  title,
  isXeMay,
  isDauGia,
  isUyQuyen,
  id,
  numeral,
}: ObjectEntityProps) => {
  const { agreementObject, deleteAgreementObject } = useHDMBXeContext();
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const rows: Array<[string, React.ReactNode]> = agreementObject
    ? [
        ["Nhãn hiệu", agreementObject["nhãn_hiệu"]],
        ["Màu sơn", agreementObject["màu_sơn"]],
        ["Loại xe", agreementObject["loại_xe"]],
        ["Số máy", agreementObject["số_máy"]],
        ["Số loại", agreementObject["số_loại"]],
        ["Số khung", agreementObject["số_khung"]],
        ["Biển số", agreementObject["biển_số"]],
        ["Số đăng ký", agreementObject["số_đăng_ký"]],
        ["Nơi cấp", agreementObject["nơi_cấp"]],
        ["Ngày cấp giấy chứng nhận", agreementObject["ngày_đăng_ký"]],
        ["Ngày đăng ký lần đầu", agreementObject["ngày_đăng_ký_lần_đầu"]],
        ["Ngày đăng ký", agreementObject["ngày_đăng_ký"]],
        ...(isUyQuyen
          ? ([
              ["Thời hạn", agreementObject["thời_hạn"]],
              ["Thời hạn bằng chữ", agreementObject["thời_hạn_bằng_chữ"]],
            ] as Array<[string, React.ReactNode]>)
          : ([
              ["Số tiền", agreementObject["số_tiền"]],
              ["Số tiền bằng chữ", agreementObject["số_tiền_bằng_chữ"]],
            ] as Array<[string, React.ReactNode]>)),
        ...(isDauGia
          ? ([
              [
                "Số giấy chứng nhận/quyết định",
                agreementObject["số_bằng_chứng_trúng_đấu_giá"],
              ],
              ["Nơi cấp đấu giá", agreementObject["nơi_cấp_đấu_giá"]],
              ["Ngày trúng đấu giá", agreementObject["ngày_trúng_đấu_giá"]],
            ] as Array<[string, React.ReactNode]>)
          : []),
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
              aria-label="Sửa thông tin xe"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteAgreementObject()}
              aria-label="Xóa thông tin xe"
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
            Thêm thông tin xe
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
          Chưa có thông tin xe. Bấm "Thêm thông tin xe" để nhập.
        </Typography>
      )}
      {open ? (
        <ThemThongTinXe
          open={open}
          isXeMay={isXeMay}
          isDauGia={isDauGia}
          isUyQuyen={isUyQuyen}
          handleClose={() => setOpen(false)}
        />
      ) : null}
    </FormSection>
  );
};
