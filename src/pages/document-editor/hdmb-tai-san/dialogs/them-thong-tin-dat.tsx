import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT,
  NGUỒN_GỐC_SỬ_DỤNG_ĐẤT,
} from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import { MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT } from "@/constants";
import type { ThongTinThuaDat } from "@/models/hdmb-tai-san";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  diện_tích_đất_bằng_số: Yup.string().required("Diện tích đất là bắt buộc"),
  diện_tích_đất_bằng_chữ: Yup.string().required("Diện tích đất là bắt buộc"),
  hình_thức_sử_dụng_đất: Yup.string().required("Hình thức sử dụng là bắt buộc"),
  loại_gcn: Yup.string().required("Loại giấy chứng nhận là bắt buộc"),
  số_gcn: Yup.string().required("Số giấy chứng nhận là bắt buộc"),
  số_vào_sổ_cấp_gcn: Yup.string().required("Số vào sổ cấp giấy chứng nhận là bắt buộc"),
  nơi_cấp_gcn: Yup.string().required("Nơi cấp giấy chứng nhận là bắt buộc"),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
  const { agreementObject, addAgreementObject } = useHDMBTaiSanContext();

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject(values);
    handleClose();
  };

  const getInitialValue = (): ThongTinThuaDat => {
    return agreementObject
      ? agreementObject
      : {
          thời_hạn_sử_dụng_đất: "",
          mục_đích_sử_dụng_đất: "",
          hình_thức_sử_dụng_đất: "",
          nguồn_gốc_sử_dụng_đất: "",
          diện_tích_đất_bằng_số: "",
          diện_tích_đất_bằng_chữ: "",
          loại_gcn: "",
          số_gcn: "",
          số_vào_sổ_cấp_gcn: "",
          nơi_cấp_gcn: "",
          ngày_cấp_gcn: "",
          địa_chỉ: "",
        };
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
                type="text"
                id="diện_tích_đất_bằng_số"
                name="diện_tích_đất_bằng_số"
                label="Diện tích (m2) *"
                value={values["diện_tích_đất_bằng_số"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "diện_tích_đất_bằng_chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_đất_bằng_chữ"
                name="diện_tích_đất_bằng_chữ"
                label="Diện tích bằng chữ *"
                value={values["diện_tích_đất_bằng_chữ"]}
                onChange={handleChange}
                error={
                  !!errors["diện_tích_đất_bằng_chữ"] &&
                  touched["diện_tích_đất_bằng_chữ"]
                }
                helperText={
                  errors["diện_tích_đất_bằng_chữ"] &&
                  touched["diện_tích_đất_bằng_chữ"] &&
                  errors["diện_tích_đất_bằng_chữ"]
                }
              />
              <TextField
                fullWidth
                id="hình_thức_sử_dụng_đất"
                name="hình_thức_sử_dụng_đất"
                label="Hình thức sử dụng *"
                value={values["hình_thức_sử_dụng_đất"]}
                onChange={handleChange}
                error={
                  !!errors["hình_thức_sử_dụng_đất"] &&
                  touched["hình_thức_sử_dụng_đất"]
                }
                helperText={
                  errors["hình_thức_sử_dụng_đất"] &&
                  touched["hình_thức_sử_dụng_đất"] &&
                  errors["hình_thức_sử_dụng_đất"]
                }
              />
              <Autocomplete
                sx={{ gridColumn: "span 3" }}
                freeSolo
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.map(
                  (item) => item.value
                )}
                value={values["loại_gcn"]}
                onChange={(_event, value) => {
                  setFieldValue("loại_gcn", value ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) => {
                      setFieldValue("loại_gcn", event.target.value ?? "");
                    }}
                    label="Loại giấy chứng nhận *"
                    error={!!errors["loại_gcn"] && touched["loại_gcn"]}
                    helperText={
                      errors["loại_gcn"] &&
                      touched["loại_gcn"] &&
                      errors["loại_gcn"]
                    }
                  />
                )}
              />
              <TextField
                fullWidth
                type="text"
                id="số_gcn"
                name="số_gcn"
                label="Số giấy chứng nhận *"
                value={values["số_gcn"]}
                onChange={handleChange}
                error={!!errors["số_gcn"] && touched["số_gcn"]}
                helperText={
                  errors["số_gcn"] && touched["số_gcn"] && errors["số_gcn"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="số_vào_sổ_cấp_gcn"
                name="số_vào_sổ_cấp_gcn"
                label="Số vào sổ cấp giấy chứng nhận *"
                value={values["số_vào_sổ_cấp_gcn"]}
                onChange={handleChange}
                error={
                  !!errors["số_vào_sổ_cấp_gcn"] && touched["số_vào_sổ_cấp_gcn"]
                }
                helperText={
                  errors["số_vào_sổ_cấp_gcn"] &&
                  touched["số_vào_sổ_cấp_gcn"] &&
                  errors["số_vào_sổ_cấp_gcn"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="nơi_cấp_gcn"
                name="nơi_cấp_gcn"
                label="Nơi cấp giấy chứng nhận *"
                value={values["nơi_cấp_gcn"]}
                onChange={handleChange}
                error={!!errors["nơi_cấp_gcn"] && touched["nơi_cấp_gcn"]}
                helperText={
                  errors["nơi_cấp_gcn"] &&
                  touched["nơi_cấp_gcn"] &&
                  errors["nơi_cấp_gcn"]
                }
              />
              <TextField
                fullWidth
                type="text"
                label="Ngày cấp giấy chứng nhận (DD/MM/YYYY)*"
                id="ngày_cấp_gcn"
                name="ngày_cấp_gcn"
                value={values["ngày_cấp_gcn"]}
                onChange={handleChange}
                error={!!errors["ngày_cấp_gcn"] && touched["ngày_cấp_gcn"]}
                helperText={
                  errors["ngày_cấp_gcn"] &&
                  touched["ngày_cấp_gcn"] &&
                  errors["ngày_cấp_gcn"]
                }
              />

              <Autocomplete
                fullWidth
                id="mục đích sử dụng"
                options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                getOptionLabel={(option) => option.label}
                value={
                  MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["mục_đích_sử_dụng_đất"]
                  ) ?? null
                }
                onChange={(_event, value) => {
                  setFieldValue("mục_đích_sử_dụng_đất", value?.value ?? "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Mục đích sử dụng *" />
                )}
              />
              <TextField
                fullWidth
                id="thời_hạn_sử_dụng"
                name="thời_hạn_sử_dụng"
                label="Thời hạn sử dụng *"
                value={values["thời_hạn_sử_dụng_đất"]}
                onChange={(event) => {
                  setFieldValue("thời_hạn_sử_dụng_đất", event.target.value);
                }}
              />
              <Autocomplete
                sx={{ gridColumn: "span 3" }}
                freeSolo
                options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
                value={values["nguồn_gốc_sử_dụng_đất"]}
                onChange={(_event, value) => {
                  setFieldValue("nguồn_gốc_sử_dụng_đất", value ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) => {
                      setFieldValue(
                        "nguồn_gốc_sử_dụng_đất",
                        event.target.value ?? ""
                      );
                    }}
                    label="Nguồn gốc sử dụng"
                    error={
                      !!errors["nguồn_gốc_sử_dụng_đất"] &&
                      touched["nguồn_gốc_sử_dụng_đất"]
                    }
                    helperText={
                      errors["nguồn_gốc_sử_dụng_đất"] &&
                      touched["nguồn_gốc_sử_dụng_đất"] &&
                      errors["nguồn_gốc_sử_dụng_đất"]
                    }
                  />
                )}
              />
              <TextField
                sx={{ gridColumn: "span 3" }}
                fullWidth
                id="địa_chỉ"
                name="địa_chỉ"
                label="Địa chỉ"
                value={values["địa_chỉ"]}
                onChange={handleChange}
                error={!!errors["địa_chỉ"] && touched["địa_chỉ"]}
                helperText={
                  errors["địa_chỉ"] && touched["địa_chỉ"] && errors["địa_chỉ"]
                }
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
