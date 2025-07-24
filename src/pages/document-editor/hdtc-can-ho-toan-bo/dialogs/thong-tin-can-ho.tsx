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
import { CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT } from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import type { ThongTinCanHo } from "@/models/hdmb-can-ho";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";

interface ThongTinCanHoProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_căn_hộ: Yup.string().required("Số căn hộ là bắt buộc"),
  tên_toà_nhà: Yup.string().required("Tên toà nhà là bắt buộc"),
  địa_chỉ_toà_nhà: Yup.string().required("Địa chỉ toà nhà là bắt buộc"),
  loại_gcn: Yup.string().required("Loại giấy chứng nhận là bắt buộc"),
  số_gcn: Yup.string().required("Số giấy chứng nhận là bắt buộc"),
  số_vào_sổ_cấp_gcn: Yup.string().required(
    "Số vào sổ cấp giấy chứng nhận là bắt buộc"
  ),
  nơi_cấp_gcn: Yup.string().required("Nơi cấp giấy chứng nhận là bắt buộc"),
  ngày_cấp_gcn: Yup.string().required("Ngày cấp giấy chứng nhận là bắt buộc"),
  hình_thức_sở_hữu_căn_hộ: Yup.string().required(
    "Hình thức sở hữu căn hộ là bắt buộc"
  ),
});

export const ThongTinCanHoDialog = ({
  open,
  handleClose,
}: ThongTinCanHoProps) => {
  const { canHo, addCanHo } = useHDMBCanHoContext();

  const submitForm = (values: ThongTinCanHo) => {
    addCanHo(values);
    handleClose();
  };

  const getInitialValue = (): ThongTinCanHo => {
    return canHo
      ? canHo
      : {
          số_căn_hộ: "",
          tên_toà_nhà: "",
          địa_chỉ_toà_nhà: "",
          loại_gcn: "",
          số_gcn: "",
          số_vào_sổ_cấp_gcn: "",
          nơi_cấp_gcn: "",
          ngày_cấp_gcn: "",
          diện_tích_sàn_bằng_số: "",
          diện_tích_sàn_bằng_chữ: "",
          cấp_hạng: "",
          tầng_có_căn_hộ: "",
          kết_cấu: "",
          hình_thức_sở_hữu_căn_hộ: "",
          năm_hoàn_thành_xây_dựng: "",
          ghi_chú_căn_hộ: "",
          giá_căn_hộ_bằng_số: "0",
          giá_căn_hộ_bằng_chữ: "không",
        };
  };

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    useFormik<ThongTinCanHo>({
      initialValues: getInitialValue(),
      validationSchema,
      onSubmit: submitForm,
    });

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin căn hộ</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="số_căn_hộ"
                name="số_căn_hộ"
                label="Số căn hộ *"
                value={values["số_căn_hộ"]}
                onChange={handleChange}
                error={!!errors["số_căn_hộ"] && touched["số_căn_hộ"]}
                helperText={
                  errors["số_căn_hộ"] &&
                  touched["số_căn_hộ"] &&
                  errors["số_căn_hộ"]
                }
              />
              <TextField
                fullWidth
                id="tên_toà_nhà"
                name="tên_toà_nhà"
                label="Tên toà nhà *"
                value={values["tên_toà_nhà"]}
                onChange={handleChange}
                error={!!errors["tên_toà_nhà"] && touched["tên_toà_nhà"]}
                helperText={
                  errors["tên_toà_nhà"] &&
                  touched["tên_toà_nhà"] &&
                  errors["tên_toà_nhà"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="địa_chỉ_toà_nhà"
                name="địa_chỉ_toà_nhà"
                label="Địa chỉ toà nhà *"
                value={values["địa_chỉ_toà_nhà"]}
                onChange={handleChange}
              />
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
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
              <TextField
                fullWidth
                type="text"
                id="diện_tích_sàn_bằng_số"
                name="diện_tích_sàn_bằng_số"
                label="Diện tích sàn bằng số *"
                value={values["diện_tích_sàn_bằng_số"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "diện_tích_sàn_bằng_chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
                error={
                  !!errors["diện_tích_sàn_bằng_chữ"] &&
                  touched["diện_tích_sàn_bằng_chữ"]
                }
                helperText={
                  errors["diện_tích_sàn_bằng_chữ"] &&
                  touched["diện_tích_sàn_bằng_chữ"] &&
                  errors["diện_tích_sàn_bằng_chữ"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_sàn_bằng_chữ"
                name="diện_tích_sàn_bằng_chữ"
                label="Diện tích bằng chữ *"
                value={values["diện_tích_sàn_bằng_chữ"]}
                onChange={handleChange}
                error={
                  !!errors["diện_tích_sàn_bằng_chữ"] &&
                  touched["diện_tích_sàn_bằng_chữ"]
                }
                helperText={
                  errors["diện_tích_sàn_bằng_chữ"] &&
                  touched["diện_tích_sàn_bằng_chữ"] &&
                  errors["diện_tích_sàn_bằng_chữ"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="cấp_hạng"
                name="cấp_hạng"
                label="Cấp hạng"
                value={values["cấp_hạng"]}
                onChange={handleChange}
                error={!!errors["cấp_hạng"] && touched["cấp_hạng"]}
                helperText={
                  errors["cấp_hạng"] &&
                  touched["cấp_hạng"] &&
                  errors["cấp_hạng"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="tầng_có_căn_hộ"
                name="tầng_có_căn_hộ"
                label="Tầng có căn hộ"
                value={values["tầng_có_căn_hộ"]}
                onChange={handleChange}
                error={!!errors["tầng_có_căn_hộ"] && touched["tầng_có_căn_hộ"]}
                helperText={
                  errors["tầng_có_căn_hộ"] &&
                  touched["tầng_có_căn_hộ"] &&
                  errors["tầng_có_căn_hộ"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="kết_cấu"
                name="kết_cấu"
                label="Kết cấu"
                value={values["kết_cấu"]}
                onChange={handleChange}
                error={!!errors["kết_cấu"] && touched["kết_cấu"]}
                helperText={
                  errors["kết_cấu"] && touched["kết_cấu"] && errors["kết_cấu"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="hình_thức_sở_hữu_căn_hộ"
                name="hình_thức_sở_hữu_căn_hộ"
                label="Hình thức sở hữu căn hộ *"
                value={values["hình_thức_sở_hữu_căn_hộ"]}
                onChange={handleChange}
                error={
                  !!errors["hình_thức_sở_hữu_căn_hộ"] &&
                  touched["hình_thức_sở_hữu_căn_hộ"]
                }
                helperText={
                  errors["hình_thức_sở_hữu_căn_hộ"] &&
                  touched["hình_thức_sở_hữu_căn_hộ"] &&
                  errors["hình_thức_sở_hữu_căn_hộ"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="năm_hoàn_thành_xây_dựng"
                name="năm_hoàn_thành_xây_dựng"
                label="Năm hoàn thành xây dựng"
                value={values["năm_hoàn_thành_xây_dựng"]}
                onChange={handleChange}
                error={
                  !!errors["năm_hoàn_thành_xây_dựng"] &&
                  touched["năm_hoàn_thành_xây_dựng"]
                }
                helperText={
                  errors["năm_hoàn_thành_xây_dựng"] &&
                  touched["năm_hoàn_thành_xây_dựng"] &&
                  errors["năm_hoàn_thành_xây_dựng"]
                }
              />
              <TextField
                sx={{ gridColumn: "span 3" }}
                fullWidth
                type="text"
                multiline
                rows={4}
                id="ghi_chú_căn_hộ"
                name="ghi_chú_căn_hộ"
                label="Ghi chú căn hộ"
                value={values["ghi_chú_căn_hộ"]}
                onChange={handleChange}
                error={!!errors["ghi_chú_căn_hộ"] && touched["ghi_chú_căn_hộ"]}
                helperText={
                  errors["ghi_chú_căn_hộ"] &&
                  touched["ghi_chú_căn_hộ"] &&
                  errors["ghi_chú_căn_hộ"]
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
