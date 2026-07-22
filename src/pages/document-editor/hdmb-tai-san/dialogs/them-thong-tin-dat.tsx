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
import type { ThongTinThuaDat } from "@/models/hdmb-tai-san";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";
import { SearchEntity } from "@/components/common/search-entity";
import { saveContractEntity } from "@/api/contract_entity";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_giấy_chứng_nhận: Yup.string().required("Số giấy chứng nhận là bắt buộc"),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
  const { taiSan, agreementObject, addAgreementObject } =
    useHDMBTaiSanContext();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject(values);
    setSaveLoading(true);
    const payload = { ...taiSan, ...values };
    saveContractEntity(values.số_giấy_chứng_nhận, payload).finally(() => {
      setSaveLoading(false);
      handleClose();
    });
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
          loại_giấy_chứng_nhận: "",
          số_giấy_chứng_nhận: "",
          số_vào_sổ_cấp_giấy_chứng_nhận: "",
          nơi_cấp_giấy_chứng_nhận: "",
          ngày_cấp_giấy_chứng_nhận: "",
          địa_chỉ: "",
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
              />
              <TextField
                fullWidth
                id="hình_thức_sử_dụng_đất"
                name="hình_thức_sử_dụng_đất"
                label="Hình thức sử dụng"
                value={values["hình_thức_sử_dụng_đất"]}
                onChange={handleChange}
              />
              <Autocomplete
                sx={{ gridColumn: "span 3" }}
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
              />
              <TextField
                fullWidth
                type="text"
                id="nơi_cấp_giấy_chứng_nhận"
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận"
                value={values["nơi_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                label="Ngày cấp giấy chứng nhận (DD/MM/YYYY)"
                id="ngày_cấp_giấy_chứng_nhận"
                name="ngày_cấp_giấy_chứng_nhận"
                value={values["ngày_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
              />
              <Autocomplete
                fullWidth
                id="mục đích sử dụng"
                freeSolo
                options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
                value={values["mục_đích_sử_dụng_đất"]}
                onChange={(_event, value) => {
                  setFieldValue("mục_đích_sử_dụng_đất", value ?? "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Mục đích sử dụng" onChange={(event) => {
                    setFieldValue("mục_đích_sử_dụng_đất", event.target.value ?? "");
                  }} />
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
