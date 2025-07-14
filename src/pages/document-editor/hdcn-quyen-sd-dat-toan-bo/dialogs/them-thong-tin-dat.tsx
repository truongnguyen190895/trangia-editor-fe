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
      "số thửa đất": "",
      "tờ bản đồ": "",
      "địa chỉ cũ": "",
      "địa chỉ mới": "",
      "loại giấy chứng nhận": "",
      "số giấy chứng nhận": "",
      "số vào sổ cấp giấy chứng nhận": "",
      "nơi cấp giấy chứng nhận": "",
      "ngày cấp giấy chứng nhận": "",
      "diện tích": "",
      "diện tích bằng chữ": "",
      "hình thức sử dụng": "",
      "mục đích sử dụng": "",
      "thời hạn sử dụng": "",
      "nguồn gốc sử dụng": "",
      "giá tiền": "",
      "giá tiền bằng chữ": "",
      "ghi chú": "",
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
                id="số thửa đất"
                name="số thửa đất"
                label="Số thửa đất *"
                value={values["số thửa đất"]}
                onChange={handleChange}
                error={!!errors["số thửa đất"] && touched["số thửa đất"]}
                helperText={
                  errors["số thửa đất"] &&
                  touched["số thửa đất"] &&
                  errors["số thửa đất"]
                }
              />
              <TextField
                fullWidth
                id="tờ bản đồ"
                name="tờ bản đồ"
                label="Tờ bản đồ số *"
                value={values["tờ bản đồ"]}
                onChange={handleChange}
                error={!!errors["tờ bản đồ"] && touched["tờ bản đồ"]}
                helperText={
                  errors["tờ bản đồ"] &&
                  touched["tờ bản đồ"] &&
                  errors["tờ bản đồ"]
                }
              />
              <TextField
                fullWidth
                id="địa chỉ cũ"
                name="địa chỉ cũ"
                label="Địa chỉ *"
                value={values["địa chỉ cũ"]}
                onChange={handleChange}
                error={!!errors["địa chỉ cũ"] && touched["địa chỉ cũ"]}
                helperText={
                  errors["địa chỉ cũ"] &&
                  touched["địa chỉ cũ"] &&
                  errors["địa chỉ cũ"]
                }
              />
              <TextField
                fullWidth
                id="loại giấy chứng nhận"
                name="loại giấy chứng nhận"
                label="Loại giấy tờ *"
                value={values["loại giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["loại giấy chứng nhận"] &&
                  touched["loại giấy chứng nhận"]
                }
                helperText={
                  errors["loại giấy chứng nhận"] &&
                  touched["loại giấy chứng nhận"] &&
                  errors["loại giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="số giấy chứng nhận"
                name="số giấy chứng nhận"
                label="Số giấy tờ *"
                value={values["số giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số giấy chứng nhận"] &&
                  touched["số giấy chứng nhận"]
                }
                helperText={
                  errors["số giấy chứng nhận"] &&
                  touched["số giấy chứng nhận"] &&
                  errors["số giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="số vào sổ cấp giấy chứng nhận"
                name="số vào sổ cấp giấy chứng nhận"
                label="Số vào sổ cấp GCN *"
                value={values["số vào sổ cấp giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số vào sổ cấp giấy chứng nhận"] &&
                  touched["số vào sổ cấp giấy chứng nhận"]
                }
                helperText={
                  errors["số vào sổ cấp giấy chứng nhận"] &&
                  touched["số vào sổ cấp giấy chứng nhận"] &&
                  errors["số vào sổ cấp giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="nơi cấp giấy chứng nhận"
                name="nơi cấp giấy chứng nhận"
                label="Nơi cấp giấy chứng nhận *"
                value={values["nơi cấp giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["nơi cấp giấy chứng nhận"] &&
                  touched["nơi cấp giấy chứng nhận"]
                }
                helperText={
                  errors["nơi cấp giấy chứng nhận"] &&
                  touched["nơi cấp giấy chứng nhận"] &&
                  errors["nơi cấp giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                id="ngày cấp giấy chứng nhận"
                name="ngày cấp giấy chứng nhận"
                label="Ngày cấp giấy chứng nhận *"
                type="date"
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={values["ngày cấp giấy chứng nhận"]}
                onChange={handleChange}
                error={
                  !!errors["ngày cấp giấy chứng nhận"] &&
                  touched["ngày cấp giấy chứng nhận"]
                }
                helperText={
                  errors["ngày cấp giấy chứng nhận"] &&
                  touched["ngày cấp giấy chứng nhận"] &&
                  errors["ngày cấp giấy chứng nhận"]
                }
              />
              <TextField
                fullWidth
                type="number"
                id="diện tích"
                name="diện tích"
                label="Diện tích (m2) *"
                value={values["diện tích"]}
                onChange={handleChange}
                error={!!errors["diện tích"] && touched["diện tích"]}
                helperText={
                  errors["diện tích"] &&
                  touched["diện tích"] &&
                  errors["diện tích"]
                }
              />
              <TextField
                fullWidth
                id="hình thức sử dụng"
                name="hình thức sử dụng"
                label="Hình thức sử dụng *"
                value={values["hình thức sử dụng"]}
                onChange={handleChange}
                error={
                  !!errors["hình thức sử dụng"] && touched["hình thức sử dụng"]
                }
                helperText={
                  errors["hình thức sử dụng"] &&
                  touched["hình thức sử dụng"] &&
                  errors["hình thức sử dụng"]
                }
              />
              <TextField
                fullWidth
                id="mục đích sử dụng"
                name="mục đích sử dụng"
                label="Mục đích sử dụng *"
                value={values["mục đích sử dụng"]}
                onChange={handleChange}
                error={
                  !!errors["mục đích sử dụng"] && touched["mục đích sử dụng"]
                }
                helperText={
                  errors["mục đích sử dụng"] &&
                  touched["mục đích sử dụng"] &&
                  errors["mục đích sử dụng"]
                }
              />
              <TextField
                fullWidth
                id="thời hạn sử dụng"
                name="thời hạn sử dụng"
                label="Thời hạn sử dụng *"
                value={values["thời hạn sử dụng"]}
                onChange={handleChange}
                error={
                  !!errors["thời hạn sử dụng"] && touched["thời hạn sử dụng"]
                }
                helperText={
                  errors["thời hạn sử dụng"] &&
                  touched["thời hạn sử dụng"] &&
                  errors["thời hạn sử dụng"]
                }
              />
              <TextField
                fullWidth
                id="nguồn gốc sử dụng"
                name="nguồn gốc sử dụng"
                label="Nguồn gốc sử dụng *"
                value={values["nguồn gốc sử dụng"]}
                onChange={handleChange}
                error={
                  !!errors["nguồn gốc sử dụng"] && touched["nguồn gốc sử dụng"]
                }
                helperText={
                  errors["nguồn gốc sử dụng"] &&
                  touched["nguồn gốc sử dụng"] &&
                  errors["nguồn gốc sử dụng"]
                }
              />
              <TextField
                fullWidth
                id="giá tiền"
                name="giá tiền"
                label="Giá tiền *"
                value={values["giá tiền"]}
                onChange={handleChange}
                error={!!errors["giá tiền"] && touched["giá tiền"]}
                helperText={
                  errors["giá tiền"] &&
                  touched["giá tiền"] &&
                  errors["giá tiền"]
                }
              />
              <TextField
                fullWidth
                id="giá tiền bằng chữ"
                name="giá tiền bằng chữ"
                label="Giá tiền bằng chữ *"
                value={values["giá tiền bằng chữ"]}
                onChange={handleChange}
                error={
                  !!errors["giá tiền bằng chữ"] && touched["giá tiền bằng chữ"]
                }
                helperText={
                  errors["giá tiền bằng chữ"] &&
                  touched["giá tiền bằng chữ"] &&
                  errors["giá tiền bằng chữ"]
                }
              />
              <Box sx={{ gridColumn: "span 3" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="ghi chú"
                  name="ghi chú"
                  label="Ghi chú"
                  value={values["ghi chú"]}
                  onChange={handleChange}
                  error={!!errors["ghi chú"] && touched["ghi chú"]}
                  helperText={
                    errors["ghi chú"] && touched["ghi chú"] && errors["ghi chú"]
                  }
                />
              </Box>
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
