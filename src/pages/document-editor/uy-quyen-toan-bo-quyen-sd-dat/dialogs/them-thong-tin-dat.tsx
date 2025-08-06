import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import { CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT } from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";

interface ThemThongTinDatProps {
  open: boolean;
  isTangCho?: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_thửa_đất: Yup.string().required("Số thửa đất là bắt buộc"),
  số_tờ_bản_đồ: Yup.string().required("Tờ bản đồ số là bắt buộc"),
  địa_chỉ_cũ: Yup.string().optional(),
  địa_chỉ_mới: Yup.string().required("Địa chỉ là bắt buộc"),
  loại_giấy_chứng_nhận: Yup.string().required("Loại giấy tờ là bắt buộc"),
  số_giấy_chứng_nhận: Yup.string().required("Số giấy tờ là bắt buộc"),
  số_vào_sổ_cấp_giấy_chứng_nhận: Yup.string().required(
    "Số vào sổ cấp GCN là bắt buộc"
  ),
  nơi_cấp_giấy_chứng_nhận: Yup.string().required(
    "Nơi cấp giấy chứng nhận là bắt buộc"
  ),
  ngày_cấp_giấy_chứng_nhận: Yup.string().required(
    "Ngày cấp giấy chứng nhận là bắt buộc"
  ),
  thời_hạn: Yup.string().required("Thời hạn uỷ quyền là bắt buộc"),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
  isTangCho = false,
}: ThemThongTinDatProps) => {
  const { agreementObject, addAgreementObject } = useHdcnQuyenSdDatContext();

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject({
      ...values,
    });
    handleClose();
  };

  const getInitialValue = (): ThongTinThuaDat => {
    return (
      agreementObject ?? {
        số_thửa_đất: "",
        số_tờ_bản_đồ: "",
        địa_chỉ_cũ: "",
        địa_chỉ_mới: "",
        loại_giấy_chứng_nhận: "",
        số_giấy_chứng_nhận: "",
        số_vào_sổ_cấp_giấy_chứng_nhận: "",
        nơi_cấp_giấy_chứng_nhận: "",
        ngày_cấp_giấy_chứng_nhận: "",
        diện_tích: "",
        diện_tích_bằng_chữ: "",
        hình_thức_sử_dụng: "",
        nguồn_gốc_sử_dụng: null,
        giá_tiền: isTangCho ? "0" : "",
        giá_tiền_bằng_chữ: isTangCho ? "Không" : "",
        ghi_chú: "",
        mục_đích_và_thời_hạn_sử_dụng: [],
        thời_hạn: null,
        thời_hạn_bằng_chữ: null,
      }
    );
  };

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    useFormik<ThongTinThuaDat>({
      initialValues: getInitialValue(),
      validationSchema,
      onSubmit: submitForm,
    });

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin đất</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="số_thửa_đất"
                name="số_thửa_đất"
                label="Số thửa đất *"
                value={values["số_thửa_đất"]}
                onChange={handleChange}
                error={!!errors["số_thửa_đất"] && touched["số_thửa_đất"]}
                helperText={
                  errors["số_thửa_đất"] &&
                  touched["số_thửa_đất"] &&
                  errors["số_thửa_đất"]
                }
              />
              <TextField
                fullWidth
                id="số_tờ_bản_đồ"
                name="số_tờ_bản_đồ"
                label="Tờ bản đồ số *"
                value={values["số_tờ_bản_đồ"]}
                onChange={handleChange}
                error={!!errors["số_tờ_bản_đồ"] && touched["số_tờ_bản_đồ"]}
                helperText={
                  errors["số_tờ_bản_đồ"] &&
                  touched["số_tờ_bản_đồ"] &&
                  errors["số_tờ_bản_đồ"]
                }
              />
              <TextField
                fullWidth
                id="địa_chỉ_cũ"
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
                value={values["địa_chỉ_cũ"]}
                onChange={handleChange}
                error={!!errors["địa_chỉ_cũ"] && touched["địa_chỉ_cũ"]}
                helperText={
                  errors["địa_chỉ_cũ"] &&
                  touched["địa_chỉ_cũ"] &&
                  errors["địa_chỉ_cũ"]
                }
              />
              <TextField
                fullWidth
                id="địa_chỉ_mới"
                name="địa_chỉ_mới"
                label="Địa chỉ mới *"
                value={values["địa_chỉ_mới"]}
                onChange={handleChange}
                error={!!errors["địa_chỉ_mới"] && touched["địa_chỉ_mới"]}
                helperText={
                  errors["địa_chỉ_mới"] &&
                  touched["địa_chỉ_mới"] &&
                  errors["địa_chỉ_mới"]
                }
              />
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT}
                value={
                  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["loại_giấy_chứng_nhận"]
                  ) ?? null
                }
                getOptionLabel={(option) => option.label}
                onChange={(_event, value) => {
                  handleChange({
                    target: {
                      name: "loại_giấy_chứng_nhận",
                      value: value?.value,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      !!errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"]
                    }
                    helperText={
                      errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"] &&
                      errors["loại_giấy_chứng_nhận"]
                    }
                    label="Loại giấy chứng nhận *"
                    name="loại_giấy_chứng_nhận"
                  />
                )}
              />
              <TextField
                fullWidth
                id="số_giấy_chứng_nhận"
                name="số_giấy_chứng_nhận"
                label="Số giấy tờ *"
                value={values["số_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số_giấy_chứng_nhận"] &&
                  touched["số_giấy_chứng_nhận"]
                }
                helperText={
                  errors["số_giấy_chứng_nhận"] &&
                  touched["số_giấy_chứng_nhận"] &&
                  errors["số_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="số_vào_sổ_cấp_giấy_chứng_nhận"
                name="số_vào_sổ_cấp_giấy_chứng_nhận"
                label="Số vào sổ cấp GCN *"
                value={values["số_vào_sổ_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  touched["số_vào_sổ_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  touched["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  errors["số_vào_sổ_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="nơi_cấp_giấy_chứng_nhận"
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận *"
                value={values["nơi_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["nơi_cấp_giấy_chứng_nhận"] &&
                  touched["nơi_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["nơi_cấp_giấy_chứng_nhận"] &&
                  touched["nơi_cấp_giấy_chứng_nhận"] &&
                  errors["nơi_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="ngày_cấp_giấy_chứng_nhận"
                name="ngày_cấp_giấy_chứng_nhận"
                label="Ngày cấp giấy chứng nhận *"
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={values["ngày_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["ngày_cấp_giấy_chứng_nhận"] &&
                  touched["ngày_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["ngày_cấp_giấy_chứng_nhận"] &&
                  touched["ngày_cấp_giấy_chứng_nhận"] &&
                  errors["ngày_cấp_giấy_chứng_nhận"]
                }
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                Thông tin liên quan đến việc uỷ quyền
              </Typography>
              <Box py="1rem">
                <TextField
                  fullWidth
                  id="thời_hạn"
                  name="thời_hạn"
                  label="Thời hạn uỷ quyền (năm)*"
                  placeholder="Ví dụ: 10"
                  value={values["thời_hạn"]}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue(
                      "thời_hạn_bằng_chữ",
                      numberToVietnamese(
                        e.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                      )?.toLocaleLowerCase()
                    );
                  }}
                  error={!!errors["thời_hạn"] && touched["thời_hạn"]}
                  helperText={
                    errors["thời_hạn"] &&
                    touched["thời_hạn"] &&
                    errors["thời_hạn"]
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
