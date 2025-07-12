import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
    
  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Thêm thông tin đất</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <TextField
              fullWidth
              id="so_thua_dat"
              name="so_thua_dat"
              label="Số thửa đất *"
            />
            <TextField
              fullWidth
              id="to_ban_do_so"
              name="to_ban_do_so"
              label="Tờ bản đồ số *"
            />
            <TextField
              fullWidth
              id="dia_chi"
              name="dia_chi"
              label="Địa chỉ *"
            />
            <TextField
              fullWidth
              id="loai_giay_to"
              name="loai_giay_to"
              label="Loại giấy tờ *"
            />
            <TextField
              fullWidth
              id="so_giay_to"
              name="so_giay_to"
              label="Số giấy tờ *"
            />
            <TextField
              fullWidth
              id="so_vao_so_cap_gcn"
              name="so_vao_so_cap_gcn"
              label="Số vào sổ cấp GCN *"
            />
            <TextField
              fullWidth
              id="noi_cap_giay_chung_nhan"
              name="noi_cap_giay_chung_nhan"
              label="Nơi cấp giấy chứng nhận *"
            />
            <TextField
              fullWidth
              id="ngay_cap_giay_chung_nhan"
              name="ngay_cap_giay_chung_nhan"
              label="Ngày cấp giấy chứng nhận *"
              type="date"
              slotProps={{
                htmlInput: { max: new Date().toISOString().split("T")[0] },
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              fullWidth
              type="number"
              id="dien_tich"
              name="dien_tich"
              label="Diện tích (m2) *"
            />
            <TextField
              fullWidth
              id="hinh_thuc_su_dung"
              name="hinh_thuc_su_dung"
              label="Hình thức sử dụng *"
            />
            <TextField
              fullWidth
              id="muc_dich_su_dung"
              name="muc_dich_su_dung"
              label="Mục đích sử dụng *"
            />
            <TextField
              fullWidth
              id="thoi_han_su_dung"
              name="thoi_han_su_dung"
              label="Thời hạn sử dụng *"
            />
            <TextField
              fullWidth
              id="nguon_goc_su_dung"
              name="nguon_goc_su_dung"
              label="Nguồn gốc sử dụng *"
            />
            <TextField fullWidth id="ghi_chu" name="ghi_chu" label="Ghi chú" />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
