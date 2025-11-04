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
import { NGUỒN_GỐC_SỬ_DỤNG_ĐẤT } from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import { MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT } from "@/constants";
import type { ThongTinThuaDat } from "@/models/hdmb-can-ho";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { SearchEntity } from "@/components/common/search-entity";
import { saveContractEntity } from "@/api/contract_entity";
import { useState } from "react";
import { checkIsObjectEmpty } from "@/utils/common";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
  const { canHo, agreementObject, addAgreementObject } = useHDMBCanHoContext();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const submitForm = (values: ThongTinThuaDat) => {
    const allEmpty = checkIsObjectEmpty(values);
    if (allEmpty) {
      handleClose();
      return;
    }
    addAgreementObject(values);
    setSaveLoading(true);
    if (canHo && canHo?.số_gcn) {
      const payload = { ...values, ...canHo };
      saveContractEntity(canHo?.số_gcn, payload).finally(() => {
        setSaveLoading(false);
        handleClose();
      });
    } else {
      // no saving
      handleClose();
    }
  };

  const getInitialValue = (): ThongTinThuaDat => {
    return agreementObject
      ? agreementObject
      : {
          số_thửa_đất: "",
          số_tờ_bản_đồ: "",
          diện_tích_đất_bằng_số: "",
          diện_tích_đất_bằng_chữ: "",
          hình_thức_sở_hữu_đất: "",
          mục_đích_sở_hữu_đất: "",
          thời_hạn_sử_dụng_đất: "",
          nguồn_gốc_sử_dụng_đất: "",
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
    onSubmit: submitForm,
  });

  const handleSearch = (response: any) => {
    if (response) {
      setValues({
        ...values,
        ...response,
        mục_đích_sở_hữu_đất:
          response?.mục_đích_sở_hữu_đất?.value ?? response?.mục_đích_sở_hữu_đất,
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
                  touched["diện_tích_đất_bằng_chữ"] &&
                  errors["diện_tích_đất_bằng_chữ"]
                }
              />
              <TextField
                fullWidth
                id="hình_thức_sở_hữu_đất"
                name="hình_thức_sở_hữu_đất"
                label="Hình thức sử dụng"
                value={values["hình_thức_sở_hữu_đất"]}
                onChange={handleChange}
                error={
                  !!errors["hình_thức_sở_hữu_đất"] &&
                  touched["hình_thức_sở_hữu_đất"]
                }
                helperText={
                  errors["hình_thức_sở_hữu_đất"] &&
                  touched["hình_thức_sở_hữu_đất"] &&
                  errors["hình_thức_sở_hữu_đất"]
                }
              />
              <Autocomplete
                fullWidth
                freeSolo
                id="mục đích sử dụng"
                options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT}
                value={values["mục_đích_sở_hữu_đất"]}
                onChange={(_event, value) => {
                  setFieldValue(
                    "mục_đích_sở_hữu_đất",
                    typeof value === "string"
                      ? value
                      : (value as { value: string })?.value ?? ""
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
                    error={
                      !!errors["mục_đích_sở_hữu_đất"] &&
                      touched["mục_đích_sở_hữu_đất"]
                    }
                    helperText={
                      errors["mục_đích_sở_hữu_đất"] &&
                      touched["mục_đích_sở_hữu_đất"] &&
                      errors["mục_đích_sở_hữu_đất"]
                    }
                  />
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
                sx={{ gridColumn: "span 2" }}
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
