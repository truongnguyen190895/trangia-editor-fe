import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  so_thua_dat: Yup.string().required("Số thửa đất là bắt buộc"),
  to_ban_do_so: Yup.string().required("Tờ bản đồ số là bắt buộc"),
  dia_chi: Yup.string().required("Địa chỉ là bắt buộc"),
  loai_giay_to: Yup.string().required("Loại giấy tờ là bắt buộc"),
  so_giay_to: Yup.string().required("Số giấy tờ là bắt buộc"),
  so_vao_so_cap_gcn: Yup.string().required("Số vào sổ cấp GCN là bắt buộc"),
  noi_cap_giay_chung_nhan: Yup.string().required(
    "Nơi cấp giấy chứng nhận là bắt buộc"
  ),
  ngay_cap_giay_chung_nhan: Yup.string().required(
    "Ngày cấp giấy chứng nhận là bắt buộc"
  ),
  dien_tich: Yup.number().required("Diện tích là bắt buộc"),
  hinh_thuc_su_dung: Yup.string().required("Hình thức sử dụng là bắt buộc"),
  muc_dich_su_dung: Yup.string().required("Mục đích sử dụng là bắt buộc"),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
  const { editObjectIndex, agreementObjects, addAgreementObject } =
    useHdcnQuyenSdDatContext();
  const isEdit = editObjectIndex !== null;

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject(values, editObjectIndex ?? undefined);
    handleClose();
  };

  const getInitialValue = (): ThongTinThuaDat => {
    if (isEdit) {
      return agreementObjects[editObjectIndex];
    }
    return {
      so_thua_dat: "",
      to_ban_do_so: "",
      dia_chi: "",
      loai_giay_to: "",
      so_giay_to: "",
      so_vao_so_cap_gcn: "",
      noi_cap_giay_chung_nhan: "",
      ngay_cap_giay_chung_nhan: "",
      dien_tich: 0,
      hinh_thuc_su_dung: "",
      muc_dich_su_dung: "",
      thoi_han_su_dung: "",
      nguon_goc_su_dung: "",
      ghi_chu: "",
    };
  };

  const initialValues = getInitialValue();

  const { values, errors, touched, handleChange, handleSubmit } =
    useFormik<ThongTinThuaDat>({
      initialValues,
      validationSchema,
      onSubmit: submitForm,
    });

  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin đất</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="so_thua_dat"
                name="so_thua_dat"
                label="Số thửa đất *"
                value={values.so_thua_dat}
                onChange={handleChange}
                error={!!errors.so_thua_dat && touched.so_thua_dat}
                helperText={
                  errors.so_thua_dat &&
                  touched.so_thua_dat &&
                  errors.so_thua_dat
                }
              />
              <TextField
                fullWidth
                id="to_ban_do_so"
                name="to_ban_do_so"
                label="Tờ bản đồ số *"
                value={values.to_ban_do_so}
                onChange={handleChange}
                error={!!errors.to_ban_do_so && touched.to_ban_do_so}
                helperText={
                  errors.to_ban_do_so &&
                  touched.to_ban_do_so &&
                  errors.to_ban_do_so
                }
              />
              <TextField
                fullWidth
                id="dia_chi"
                name="dia_chi"
                label="Địa chỉ *"
                value={values.dia_chi}
                onChange={handleChange}
                error={!!errors.dia_chi && touched.dia_chi}
                helperText={errors.dia_chi && touched.dia_chi && errors.dia_chi}
              />
              <TextField
                fullWidth
                id="loai_giay_to"
                name="loai_giay_to"
                label="Loại giấy tờ *"
                value={values.loai_giay_to}
                onChange={handleChange}
                error={!!errors.loai_giay_to && touched.loai_giay_to}
                helperText={
                  errors.loai_giay_to &&
                  touched.loai_giay_to &&
                  errors.loai_giay_to
                }
              />
              <TextField
                fullWidth
                id="so_giay_to"
                name="so_giay_to"
                label="Số giấy tờ *"
                value={values.so_giay_to}
                onChange={handleChange}
                error={!!errors.so_giay_to && touched.so_giay_to}
                helperText={
                  errors.so_giay_to && touched.so_giay_to && errors.so_giay_to
                }
              />
              <TextField
                fullWidth
                id="so_vao_so_cap_gcn"
                name="so_vao_so_cap_gcn"
                label="Số vào sổ cấp GCN *"
                value={values.so_vao_so_cap_gcn}
                onChange={handleChange}
                error={!!errors.so_vao_so_cap_gcn && touched.so_vao_so_cap_gcn}
                helperText={
                  errors.so_vao_so_cap_gcn &&
                  touched.so_vao_so_cap_gcn &&
                  errors.so_vao_so_cap_gcn
                }
              />
              <TextField
                fullWidth
                id="noi_cap_giay_chung_nhan"
                name="noi_cap_giay_chung_nhan"
                label="Nơi cấp giấy chứng nhận *"
                value={values.noi_cap_giay_chung_nhan}
                onChange={handleChange}
                error={
                  !!errors.noi_cap_giay_chung_nhan &&
                  touched.noi_cap_giay_chung_nhan
                }
                helperText={
                  errors.noi_cap_giay_chung_nhan &&
                  touched.noi_cap_giay_chung_nhan &&
                  errors.noi_cap_giay_chung_nhan
                }
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
                value={values.ngay_cap_giay_chung_nhan}
                onChange={handleChange}
                error={
                  !!errors.ngay_cap_giay_chung_nhan &&
                  touched.ngay_cap_giay_chung_nhan
                }
                helperText={
                  errors.ngay_cap_giay_chung_nhan &&
                  touched.ngay_cap_giay_chung_nhan &&
                  errors.ngay_cap_giay_chung_nhan
                }
              />
              <TextField
                fullWidth
                type="number"
                id="dien_tich"
                name="dien_tich"
                label="Diện tích (m2) *"
                value={values.dien_tich}
                onChange={handleChange}
                error={!!errors.dien_tich && touched.dien_tich}
                helperText={
                  errors.dien_tich && touched.dien_tich && errors.dien_tich
                }
              />
              <TextField
                fullWidth
                id="hinh_thuc_su_dung"
                name="hinh_thuc_su_dung"
                label="Hình thức sử dụng *"
                value={values.hinh_thuc_su_dung}
                onChange={handleChange}
                error={!!errors.hinh_thuc_su_dung && touched.hinh_thuc_su_dung}
                helperText={
                  errors.hinh_thuc_su_dung &&
                  touched.hinh_thuc_su_dung &&
                  errors.hinh_thuc_su_dung
                }
              />
              <TextField
                fullWidth
                id="muc_dich_su_dung"
                name="muc_dich_su_dung"
                label="Mục đích sử dụng *"
                value={values.muc_dich_su_dung}
                onChange={handleChange}
                error={!!errors.muc_dich_su_dung && touched.muc_dich_su_dung}
                helperText={
                  errors.muc_dich_su_dung &&
                  touched.muc_dich_su_dung &&
                  errors.muc_dich_su_dung
                }
              />
              <TextField
                fullWidth
                id="thoi_han_su_dung"
                name="thoi_han_su_dung"
                label="Thời hạn sử dụng *"
                value={values.thoi_han_su_dung}
                onChange={handleChange}
                error={!!errors.thoi_han_su_dung && touched.thoi_han_su_dung}
                helperText={
                  errors.thoi_han_su_dung &&
                  touched.thoi_han_su_dung &&
                  errors.thoi_han_su_dung
                }
              />
              <TextField
                fullWidth
                id="nguon_goc_su_dung"
                name="nguon_goc_su_dung"
                label="Nguồn gốc sử dụng *"
                value={values.nguon_goc_su_dung}
                onChange={handleChange}
                error={!!errors.nguon_goc_su_dung && touched.nguon_goc_su_dung}
                helperText={
                  errors.nguon_goc_su_dung &&
                  touched.nguon_goc_su_dung &&
                  errors.nguon_goc_su_dung
                }
              />
              <TextField
                fullWidth
                id="ghi_chu"
                name="ghi_chu"
                label="Ghi chú"
                value={values.ghi_chu}
                onChange={handleChange}
                error={!!errors.ghi_chu && touched.ghi_chu}
                helperText={errors.ghi_chu && touched.ghi_chu && errors.ghi_chu}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" type="submit">
            Thêm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
