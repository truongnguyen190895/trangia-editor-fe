import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import {
  FormikTextField,
  FormikAutocomplete,
} from "@/components/common/formik-fields";
import { saveContractEntity } from "@/api/contract_entity";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  số_gcn: Yup.string().required("Số giấy chứng nhận là bắt buộc"),
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
    saveContractEntity(values.số_gcn, payload).finally(() => {
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
          loại_gcn: "",
          số_gcn: "",
          số_vào_sổ_cấp_gcn: "",
          nơi_cấp_gcn: "",
          ngày_cấp_gcn: "",
          địa_chỉ: "",
        };
  };

  const formik = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    validationSchema,
    onSubmit: submitForm,
  });

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
                name="hình_thức_sử_dụng_đất"
                label="Hình thức sử dụng"
              />
              <FormikAutocomplete
                formik={formik}
                name="loại_gcn"
                label="Loại giấy chứng nhận"
                sx={{ gridColumn: "span 3" }}
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
              <FormikAutocomplete
                formik={formik}
                name="mục_đích_sử_dụng_đất"
                label="Mục đích sử dụng"
                options={MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
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
              <FormikTextField
                formik={formik}
                name="địa_chỉ"
                label="Địa chỉ"
                sx={{ gridColumn: "span 3" }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            color="success"
            variant="contained"
            type="submit"
            disabled={saveLoading}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
