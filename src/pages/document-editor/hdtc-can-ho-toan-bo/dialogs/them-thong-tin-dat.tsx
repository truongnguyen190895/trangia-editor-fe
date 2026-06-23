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
import { NGUỒN_GỐC_SỬ_DỤNG_ĐẤT } from "@/constants";
import { numberToVietnamese } from "@/utils/number-to-words";
import { MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT } from "@/constants";
import type { ThongTinThuaDat } from "@/models/hdmb-can-ho";
import { useHDMBCanHoContext } from "@/context/hdmb-can-ho";
import { SearchEntity } from "@/components/common/search-entity";
import {
  FormikTextField,
  FormikAutocomplete,
} from "@/components/common/formik-fields";
import { saveContractEntity } from "@/api/contract_entity";
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

  const formik = useFormik<ThongTinThuaDat>({
    initialValues: getInitialValue(),
    onSubmit: submitForm,
  });

  const handleSearch = (response: any) => {
    if (response) {
      formik.setValues({
        ...formik.values,
        ...response,
        mục_đích_sở_hữu_đất:
          response?.mục_đích_sở_hữu_đất?.value ?? response?.mục_đích_sở_hữu_đất,
      });
    }
  };
  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogTitle>Thêm thông tin đất</DialogTitle>
        <DialogContent>
          <SearchEntity
            placeholder="Nhập số giấy chứng nhận"
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
              <FormikTextField
                formik={formik}
                name="hình_thức_sở_hữu_đất"
                label="Hình thức sử dụng"
              />
              <FormikAutocomplete
                formik={formik}
                name="mục_đích_sở_hữu_đất"
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
                sx={{ gridColumn: "span 2" }}
                options={NGUỒN_GỐC_SỬ_DỤNG_ĐẤT.map((item) => item.value)}
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
