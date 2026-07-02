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
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT,
  NGUỒN_GỐC_SỬ_DỤNG_ĐẤT,
} from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import { MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT } from "@/constants";
import type { ThongTinThuaDat } from "@/models/hdmb-nha-dat";
import { useHDMBNhaDatContext } from "@/context/hdmb-nha-dat";
import { SearchEntity } from "@/components/common/search-entity";
import {
  FormikTextField,
  FormikAutocomplete,
} from "@/components/common/formik-fields";
import { saveContractEntity } from "@/api/contract_entity";

interface ThemThongTinDatProps {
  open: boolean;
  isUyQuyen?: boolean;
  handleClose: () => void;
}

export const ThemThongTinDat = ({
  open,
  isUyQuyen,
  handleClose,
}: ThemThongTinDatProps) => {
  const { nhaDat, agreementObject, addAgreementObject } =
    useHDMBNhaDatContext();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    số_gcn: Yup.string().required("Số giấy chứng nhận là bắt buộc"),
  });

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject(values);
    setSaveLoading(true);
    const payload = { ...values, ...nhaDat };
    saveContractEntity(values.số_gcn, payload).finally(() => {
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
          diện_tích_đất_một_phần_bằng_số: "",
          diện_tích_đất_một_phần_bằng_chữ: "",
          hình_thức_sở_hữu_đất: "",
          mục_đích_sở_hữu_đất: "",
          thời_hạn_sử_dụng_đất: "",
          nguồn_gốc_sử_dụng_đất: "",
          địa_chỉ_nhà_đất: "",
          địa_chỉ_cũ: "",
          loại_gcn: "",
          số_gcn: "",
          số_vào_sổ_cấp_gcn: "",
          nơi_cấp_gcn: "",
          ngày_cấp_gcn: "",
          thời_hạn: "",
          thời_hạn_bằng_chữ: "",
        };
  };

  const formik = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });
  const { values, setFieldValue } = formik;

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
        <DialogTitle>Thêm thông tin đất</DialogTitle>
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
                name="địa_chỉ_nhà_đất"
                label="Địa chỉ nhà đất"
              />
              <FormikTextField
                formik={formik}
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
              />
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
              {!isUyQuyen ? (
                <>
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
                  <FormikTextField
                    formik={formik}
                    name="diện_tích_đất_một_phần_bằng_số"
                    label="Diện tích một phần (m2)"
                    onValueChange={(value, formik) => {
                      formik.setFieldValue(
                        "diện_tích_đất_một_phần_bằng_chữ",
                        numberToVietnamese(
                          value?.replace(/\./g, "").replace(/\,/g, ".")
                        )
                      );
                    }}
                  />
                  <FormikTextField
                    formik={formik}
                    name="diện_tích_đất_một_phần_bằng_chữ"
                    label="Diện tích một phần bằng chữ"
                  />
                  <FormikTextField
                    formik={formik}
                    name="hình_thức_sở_hữu_đất"
                    label="Hình thức sử dụng"
                  />
                  <Autocomplete
                    fullWidth
                    freeSolo
                    id="mục đích sử dụng"
                    options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    value={
                      MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.find(
                        (item) => item.value === values["mục_đích_sở_hữu_đất"]
                      ) ?? null
                    }
                    onChange={(_event, value) => {
                      setFieldValue(
                        "mục_đích_sở_hữu_đất",
                        typeof value === "string" ? value : value?.value ?? ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Mục đích sử dụng"
                        onChange={(event) => {
                          setFieldValue(
                            "mục_đích_sở_hữu_đất",
                            event.target.value ?? ""
                          );
                        }}
                      />
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
                    sx={{ gridColumn: "span 2" }}
                    options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
                  />
                </>
              ) : (
                <Box>
                  <FormikTextField
                    formik={formik}
                    name="thời_hạn"
                    label="Thời hạn uỷ quyền (năm) *"
                    onValueChange={(value, formik) => {
                      formik.setFieldValue(
                        "thời_hạn_bằng_chữ",
                        numberToVietnamese(value)?.toLocaleLowerCase()
                      );
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            disabled={saveLoading}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
