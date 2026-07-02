import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import {
  FormikTextField,
  FormikAutocomplete,
} from "@/components/common/formik-fields";
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
        diện_tích_phi_nông_nghiệp: "",
        hình_thức_sử_dụng: "",
        nguồn_gốc_sử_dụng: "",
        giá_tiền: "",
        giá_tiền_bằng_chữ: "",
        ghi_chú: "",
        mục_đích_và_thời_hạn_sử_dụng: [],
        mục_đích_và_thời_hạn_sử_dụng_một_phần: [],
        một_phần_diện_tích: "",
        một_phần_diện_tích_bằng_chữ: "",
        thời_hạn: "",
        thời_hạn_bằng_chữ: "",
      }
    );
  };

  const formik = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });

  const handleSearch = (response: any) => {
    if (response) {
      setCurrentStatus(response);
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
                name="địa_chỉ_cũ"
                label="Địa chỉ cũ"
              />
              <FormikTextField
                formik={formik}
                name="địa_chỉ_mới"
                label="Địa chỉ mới"
              />
              <FormikAutocomplete
                formik={formik}
                name="loại_giấy_chứng_nhận"
                label="Loại giấy chứng nhận"
                sx={{ gridColumn: "span 2" }}
                options={CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT.map(
                  (item) => item.value
                )}
              />
              <FormikTextField
                formik={formik}
                name="số_giấy_chứng_nhận"
                label="Số giấy tờ *"
              />
              <FormikTextField
                formik={formik}
                name="số_vào_sổ_cấp_giấy_chứng_nhận"
                label="Số vào sổ cấp GCN"
              />
              <FormikTextField
                formik={formik}
                name="nơi_cấp_giấy_chứng_nhận"
                label="Nơi cấp giấy chứng nhận"
              />
              <FormikTextField
                formik={formik}
                name="ngày_cấp_giấy_chứng_nhận"
                label="Ngày cấp giấy chứng nhận"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                Thông tin liên quan đến việc uỷ quyền
              </Typography>
              <Box py="1rem">
                <FormikTextField
                  formik={formik}
                  name="thời_hạn"
                  label="Thời hạn uỷ quyền (năm)"
                  placeholder="Ví dụ: 10"
                  onValueChange={(value, formik) => {
                    formik.setFieldValue(
                      "thời_hạn_bằng_chữ",
                      numberToVietnamese(
                        value?.replace(/\./g, "").replace(/\,/g, ".")
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
