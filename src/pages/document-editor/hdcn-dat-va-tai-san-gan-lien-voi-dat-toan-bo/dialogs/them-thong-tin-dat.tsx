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
import {
  FormikTextField,
  FormikAutocomplete,
} from "@/components/common/formik-fields";
import { saveContractEntity } from "@/api/contract_entity";
import { getPeopleNameFromParty } from "@/utils/common";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
  isMotPhan?: boolean;
}

const validationSchema = Yup.object({
    số_gcn: Yup.string().required("Số thửa đất là bắt buộc"),
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
    saveContractEntity(values?.số_gcn, payload).finally(() => {
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
          hình_thức_sở_hữu_đất: "",
          mục_đích_sở_hữu_đất: "",
          thời_hạn_sử_dụng_đất: "",
          nguồn_gốc_sử_dụng_đất: "",
          địa_chỉ_nhà_đất: "",
          loại_gcn: "",
          số_gcn: "",
          số_vào_sổ_cấp_gcn: "",
          nơi_cấp_gcn: "",
          ngày_cấp_gcn: "",
          biến_động: {
            ngày: "",
            chi_nhánh: "",
            cá_thể: "",
          },
        };
  };

  const formik = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });
  const { values, setFieldValue, handleChange } = formik;

  const handleSearch = (response: any) => {
    if (response) {
      formik.setValues({
        ...formik.values,
        ...response,
      });
    }
  };

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogTitle variant="h4">Thêm thông tin đất</DialogTitle>
        <DialogContent>
          <SearchEntity
            placeholder="Nhập số giấy tờ (số sổ)"
            onSearch={handleSearch}
          />
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <FormikTextField
                formik={formik}
                name="số_thửa_đất"
                label="Số thửa đất"
              />
              <FormikTextField
                formik={formik}
                name="số_tờ_bản_đồ"
                label="Tờ bản đồ số"
              />
              <FormikTextField
                formik={formik}
                name="diện_tích_đất_bằng_số"
                label="Diện tích (m2)"
                onValueChange={(value, formik) => {
                  formik.setFieldValue(
                    "diện_tích_đất_bằng_chữ",
                    numberToVietnamese(
                      value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
              />
              <FormikTextField
                formik={formik}
                name="diện_tích_đất_bằng_chữ"
                label="Diện tích bằng chữ"
              />
              {isMotPhan && (
                <>
                  <FormikTextField
                    formik={formik}
                    name="một_phần_diện_tích_đất_bằng_số"
                    label="Diện tích một phần (m2)"
                    onValueChange={(value, formik) => {
                      formik.setFieldValue(
                        "một_phần_diện_tích_đất_bằng_chữ",
                        numberToVietnamese(
                          value?.replace(/\./g, "").replace(/\,/g, ".")
                        )
                      );
                    }}
                  />
                  <FormikTextField
                    formik={formik}
                    name="một_phần_diện_tích_đất_bằng_chữ"
                    label="Diện tích một phần bằng chữ"
                  />
                </>
              )}
              <Box sx={{ gridColumn: "span 3" }}>
                <FormikTextField
                  formik={formik}
                  name="địa_chỉ_nhà_đất"
                  label="Địa chỉ đất"
                />
              </Box>

              <FormikAutocomplete
                formik={formik}
                name="loại_gcn"
                label="Loại giấy chứng nhận"
                sx={{ gridColumn: "span 2" }}
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.map(
                  (item) => item.value
                )}
              />
              <FormikTextField
                formik={formik}
                name="số_gcn"
                label="Số giấy chứng nhận *"
              />
              <FormikTextField
                formik={formik}
                name="số_vào_sổ_cấp_gcn"
                label="Số vào sổ cấp giấy chứng nhận"
              />
              <FormikTextField
                formik={formik}
                name="nơi_cấp_gcn"
                label="Nơi cấp giấy chứng nhận"
              />
              <FormikTextField
                formik={formik}
                name="ngày_cấp_gcn"
                label="Ngày cấp giấy chứng nhận (DD/MM/YYYY)"
              />
              <FormikTextField
                formik={formik}
                name="hình_thức_sở_hữu_đất"
                label="Hình thức sử dụng"
              />

              <Autocomplete
                fullWidth
                id="mục đích sử dụng"
                options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                getOptionLabel={(option) => option.label}
                value={
                  MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.find(
                    (item) => item.value === values["mục_đích_sở_hữu_đất"]
                  ) ?? null
                }
                onChange={(_event, value) => {
                  setFieldValue("mục_đích_sở_hữu_đất", value?.value ?? "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Mục đích sử dụng" />
                )}
              />
              <FormikTextField
                formik={formik}
                name="thời_hạn_sử_dụng_đất"
                label="Thời hạn sử dụng"
              />
              <FormikAutocomplete
                formik={formik}
                name="nguồn_gốc_sử_dụng_đất"
                label="Nguồn gốc sử dụng"
                sx={{ gridColumn: "span 3" }}
                options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
              />
            </Box>
            <Box py="1rem">
              <Typography variant="body1">
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
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            variant="contained"
            type="submit"
            disabled={saveLoading}
            color={saveLoading ? "info" : "success"}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
