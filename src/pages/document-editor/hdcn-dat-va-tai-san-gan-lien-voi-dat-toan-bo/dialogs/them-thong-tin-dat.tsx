import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT,
  NGUỒN_GỐC_SỬ_DỤNG_ĐẤT,
} from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import { MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT } from "@/constants";
import type { ThongTinThuaDat } from "@/models/hdcn-dat-va-tsglvd";
import { useThemChuTheContext } from "@/context/them-chu-the";
import { useHDCNDatVaTaiSanGanLienVoiDatToanBoContext } from "@/context/hdcn-dat-va-tai-san-glvd";
import { SearchEntity } from "@/components/common/search-entity";
import { saveContractEntity } from "@/api/contract_entity";
import { getPeopleNameFromParty } from "@/utils/common";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
  isMotPhan?: boolean;
}

const validationSchema = Yup.object({
    số_giấy_chứng_nhận: Yup.string().required("Số thửa đất là bắt buộc"),
});

export const ThemThongTinDat = ({
  open,
  isMotPhan = false,
  handleClose,
}: ThemThongTinDatProps) => {
  const { taiSan, agreementObject, addAgreementObject } =
    useHDCNDatVaTaiSanGanLienVoiDatToanBoContext();
  const { partyA } = useThemChuTheContext();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const submitForm = (values: ThongTinThuaDat) => {
    const biendong =
      values?.biến_động?.ngày !== ""
        ? {
            ngày: values.biến_động?.ngày ?? "",
            chi_nhánh: values.biến_động?.chi_nhánh ?? "",
            cá_thể: getPeopleNameFromParty(partyA),
          }
        : null;
    addAgreementObject({ ...values, biến_động: biendong });
    setSaveLoading(true);
    const payload = {
      ...values,
      ...taiSan,
      biến_động: biendong,
    };
    setSaveLoading(true);
    saveContractEntity(values?.số_giấy_chứng_nhận, payload).finally(() => {
      setSaveLoading(false);
      handleClose();
    });
  };

  const getInitialValue = (): ThongTinThuaDat => {
    return agreementObject
      ? agreementObject
      : {
          số_thửa_đất: "",
          số_tờ_bản_đồ: "",
          diện_tích_đất_bằng_số: "",
          diện_tích_đất_bằng_chữ: "",
          một_phần_diện_tích_đất_bằng_số: "",
          một_phần_diện_tích_đất_bằng_chữ: "",
          hình_thức_sử_dụng_đất: "",
          mục_đích_sử_dụng_đất: "",
          thời_hạn_sử_dụng_đất: "",
          nguồn_gốc_sử_dụng_đất: "",
          địa_chỉ_nhà_đất: "",
          loại_giấy_chứng_nhận: "",
          số_giấy_chứng_nhận: "",
          số_vào_sổ_cấp_giấy_chứng_nhận: "",
          nơi_cấp_giấy_chứng_nhận: "",
          ngày_cấp_giấy_chứng_nhận: "",
          biến_động: {
            ngày: "",
            chi_nhánh: "",
            cá_thể: "",
          },
        };
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });

  const handleSearch = (response: any) => {
    if (response) {
      setValues({
        ...values,
        ...response,
      });
    }
  };

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin đất</DialogTitle>
        <DialogContent>
          <SearchEntity
            placeholder="Nhập số giấy tờ (số sổ)"
            onSearch={handleSearch}
          />
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="số_thửa_đất"
                name="số_thửa_đất"
                label="Số thửa đất"
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
                label="Tờ bản đồ số"
                value={values["số_tờ_bản_đồ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="diện_tích_đất_bằng_số"
                name="diện_tích_đất_bằng_số"
                label="Diện tích (m2)"
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
                label="Diện tích bằng chữ"
                value={values["diện_tích_đất_bằng_chữ"]}
                onChange={handleChange}
                error={
                  !!errors["diện_tích_đất_bằng_chữ"] &&
                  touched["diện_tích_đất_bằng_chữ"]
                }
                helperText={
                  errors["diện_tích_đất_bằng_chữ"] &&
                  touched["diện_tích_đất_bằng_chữ"]
                }
              />
              {isMotPhan && (
                <>
                  <TextField
                    fullWidth
                    type="text"
                    id="một_phần_diện_tích_đất_bằng_số"
                    name="một_phần_diện_tích_đất_bằng_số"
                    label="Diện tích một phần (m2)"
                    value={values["một_phần_diện_tích_đất_bằng_số"]}
                    onChange={(event) => {
                      handleChange(event);
                      setFieldValue(
                        "một_phần_diện_tích_đất_bằng_chữ",
                        numberToVietnamese(
                          event.target.value
                            ?.replace(/\./g, "")
                            .replace(/\,/g, ".")
                        )
                      );
                    }}
                  />
                  <TextField
                    fullWidth
                    type="text"
                    id="một_phần_diện_tích_đất_bằng_chữ"
                    name="một_phần_diện_tích_đất_bằng_chữ"
                    label="Diện tích một phần bằng chữ"
                    value={values["một_phần_diện_tích_đất_bằng_chữ"]}
                    onChange={handleChange}
                    error={
                      !!errors["một_phần_diện_tích_đất_bằng_chữ"] &&
                      touched["một_phần_diện_tích_đất_bằng_chữ"]
                    }
                    helperText={
                      errors["một_phần_diện_tích_đất_bằng_chữ"] &&
                      touched["một_phần_diện_tích_đất_bằng_chữ"]
                    }
                  />
                </>
              )}
              <Box sx={{ gridColumn: "span 3" }}>
                <TextField
                  fullWidth
                  id="địa_chỉ_nhà_đất"
                  name="địa_chỉ_nhà_đất"
                  label="Địa chỉ đất"
                  value={values["địa_chỉ_nhà_đất"]}
                  onChange={handleChange}
                />
              </Box>

              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                freeSolo
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.map(
                  (item) => item.value
                )}
                value={values["loại_giấy_chứng_nhận"]}
                onChange={(_event, value) => {
                  setFieldValue("loại_giấy_chứng_nhận", value ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) => {
                      setFieldValue("loại_giấy_chứng_nhận", event.target.value ?? "");
                    }}
                    label="Loại giấy chứng nhận"
                    error={!!errors["loại_giấy_chứng_nhận"] && touched["loại_giấy_chứng_nhận"]}
                    helperText={
                      errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"] &&
                      errors["loại_giấy_chứng_nhận"]
                    }
                  />
                )}
              />
              <TextField
                fullWidth
                type="text"
                id="số_giấy_chứng_nhận"
                name="số_giấy_chứng_nhận"
                label="Số giấy chứng nhận *"
                value={values["số_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={!!errors["số_giấy_chứng_nhận"] && touched["số_giấy_chứng_nhận"]}
                helperText={
                  errors["số_giấy_chứng_nhận"] && touched["số_giấy_chứng_nhận"] && errors["số_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="số_vào_sổ_cấp_giấy_chứng_nhận"
                name="số_vào_sổ_cấp_giấy_chứng_nhận"
                label="Số vào sổ cấp giấy chứng nhận"
                value={values["số_vào_sổ_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={
                  !!errors["số_vào_sổ_cấp_giấy_chứng_nhận"] && touched["số_vào_sổ_cấp_giấy_chứng_nhận"]
                }
                helperText={
                  errors["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  touched["số_vào_sổ_cấp_giấy_chứng_nhận"] &&
                  errors["số_vào_sổ_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="nơi_cấp_giấy_chứng_nhận"
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận"
                value={values["nơi_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={!!errors["nơi_cấp_giấy_chứng_nhận"] && touched["nơi_cấp_giấy_chứng_nhận"]}
                helperText={
                  errors["nơi_cấp_giấy_chứng_nhận"] &&
                  touched["nơi_cấp_giấy_chứng_nhận"] &&
                  errors["nơi_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                type="text"
                label="Ngày cấp giấy chứng nhận (DD/MM/YYYY)"
                id="ngày_cấp_giấy_chứng_nhận"
                name="ngày_cấp_giấy_chứng_nhận"
                value={values["ngày_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
                error={!!errors["ngày_cấp_giấy_chứng_nhận"] && touched["ngày_cấp_giấy_chứng_nhận"]}
                helperText={
                  errors["ngày_cấp_giấy_chứng_nhận"] &&
                  touched["ngày_cấp_giấy_chứng_nhận"] &&
                  errors["ngày_cấp_giấy_chứng_nhận"]
                }
              />
              <TextField
                fullWidth
                id="hình_thức_sử_dụng_đất"
                name="hình_thức_sử_dụng_đất"
                label="Hình thức sử dụng"
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
                  <TextField {...params} label="Mục đích sử dụng" />
                )}
              />
              <TextField
                fullWidth
                id="thời_hạn_sử_dụng"
                name="thời_hạn_sử_dụng"
                label="Thời hạn sử dụng"
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
            </Box>
            <Box py="1rem">
              <Typography variant="h6">
                Thông tin đăng ký biến động đất (nếu có)
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap={2}
                mt="1rem"
              >
                <TextField
                  fullWidth
                  id="ngày_đăng_ký_biến_động"
                  name="biến_động.ngày"
                  label="Ngày đăng ký"
                  value={values?.biến_động?.ngày}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  id="chi_nhánh_đăng_ký_biến_động"
                  name="biến_động.chi_nhánh"
                  label="Chi nhánh đăng ký"
                  value={values?.biến_động?.chi_nhánh}
                  onChange={handleChange}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" type="submit" disabled={saveLoading}>
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
