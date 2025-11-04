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
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ThongTinThuaDat } from "@/models/agreement-object";
import { useHdcnQuyenSdDatContext } from "@/context/hdcn-quyen-sd-dat-context";
import { CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT } from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import { SearchEntity } from "@/components/common/search-entity";
import { saveContractEntity } from "@/api/contract_entity";
import { useState } from "react";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_giấy_chứng_nhận: Yup.string().required("Số giấy tờ là bắt buộc"),
});

export const ThemThongTinDat = ({
  open,
  handleClose,
}: ThemThongTinDatProps) => {
  const { agreementObject, addAgreementObject } = useHdcnQuyenSdDatContext();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<any>(null);

  const submitForm = (values: ThongTinThuaDat) => {
    addAgreementObject({
      ...values,
    });
    setSaveLoading(true);
    const payload = { ...values, ...currentStatus };
    saveContractEntity(values.số_giấy_chứng_nhận, payload).finally(() => {
      setSaveLoading(false);
      handleClose();
    });
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
        nguồn_gốc_sử_dụng: "",
        giá_tiền: "",
        giá_tiền_bằng_chữ: "",
        ghi_chú: "",
        mục_đích_và_thời_hạn_sử_dụng: [],
        thời_hạn: "",
        thời_hạn_bằng_chữ: "",
      }
    );
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
      setCurrentStatus(response);
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
                id="địa_chỉ_cũ"
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
                value={values["địa_chỉ_cũ"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="địa_chỉ_mới"
                name="địa_chỉ_mới"
                label="Địa chỉ mới"
                value={values["địa_chỉ_mới"]}
                onChange={handleChange}
              />
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
                    error={
                      !!errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"]
                    }
                    helperText={
                      errors["loại_giấy_chứng_nhận"] &&
                      touched["loại_giấy_chứng_nhận"] &&
                      errors["loại_giấy_chứng_nhận"]
                    }
                    label="Loại giấy chứng nhận"
                    onChange={(event) => {
                      setFieldValue(
                        "loại_giấy_chứng_nhận",
                        event.target.value ?? ""
                      );
                    }}
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
                label="Số vào sổ cấp GCN"
                value={values["số_vào_sổ_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="nơi_cấp_giấy_chứng_nhận"
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận"
                value={values["nơi_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="ngày_cấp_giấy_chứng_nhận"
                name="ngày_cấp_giấy_chứng_nhận"
                label="Ngày cấp giấy chứng nhận"
                value={values["ngày_cấp_giấy_chứng_nhận"]}
                onChange={handleChange}
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
                  label="Thời hạn uỷ quyền (năm)"
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
                />
              </Box>
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
            disabled={saveLoading}
            color="success"
          >
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
