import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ThongTinXeOto } from "@/models/hdmb-xe";
import { numberToVietnamese } from "@/utils/number-to-words";
import { useHDMBXeContext } from "@/context/hdmb-xe";
import { saveContractEntity } from "@/api/contract_entity";
import { SearchEntity } from "@/components/common/search-entity";
import { FormikTextField } from "@/components/common/formik-fields";

interface ThemThongTinXeProps {
  open: boolean;
  isXeMay?: boolean;
  isDauGia?: boolean;
  isUyQuyen?: boolean;
  handleClose: () => void;
}

export const ThemThongTinXe = ({
  open,
  isXeMay,
  isDauGia,
  isUyQuyen,
  handleClose,
}: ThemThongTinXeProps) => {
  const { agreementObject, addAgreementObject } = useHDMBXeContext();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    số_khung: Yup.string().required("Số khung là bắt buộc"),
  });

  const submitForm = (values: ThongTinXeOto) => {
    addAgreementObject({
      ...values,
    });
    setSaveLoading(true);
    saveContractEntity(values.số_khung, values).finally(() => {
      setSaveLoading(false);
      handleClose();
    });
  };

  const getInitialValue = (): ThongTinXeOto => {
    return (
      agreementObject ?? {
        nhãn_hiệu: "",
        màu_sơn: "",
        loại_xe: "",
        số_máy: "",
        số_khung: "",
        biển_số: "",
        số_đăng_ký: "",
        nơi_cấp: "",
        ngày_đăng_ký_lần_đầu: "",
        ngày_đăng_ký: "",
        số_tiền: "",
        số_tiền_bằng_chữ: "",
        số_loại: null,
        số_bằng_chứng_trúng_đấu_giá: "",
        nơi_cấp_đấu_giá: "",
        ngày_trúng_đấu_giá: "",
        thời_hạn: "",
        thời_hạn_bằng_chữ: "",
      }
    );
  };

  const formik = useFormik<ThongTinXeOto>({
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
        <DialogTitle>Thêm thông tin xe {isXeMay ? "máy" : "ô tô"}</DialogTitle>
        <DialogContent>
          <SearchEntity placeholder="Nhập số khung" onSearch={handleSearch} />
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <FormikTextField formik={formik} name="nhãn_hiệu" label="Nhãn hiệu" />
              <FormikTextField formik={formik} name="màu_sơn" label="Màu sơn" />
              <FormikTextField formik={formik} name="loại_xe" label="Loại xe" />
              <FormikTextField formik={formik} name="số_máy" label="Số máy" />
              <FormikTextField formik={formik} name="số_khung" label="Số khung *" />
              <FormikTextField formik={formik} name="biển_số" label="Biển số" />
              <FormikTextField
                formik={formik}
                name="số_đăng_ký"
                label="Số đăng ký"
              />
              <FormikTextField formik={formik} name="nơi_cấp" label="Nơi cấp" />
              <FormikTextField
                formik={formik}
                name="ngày_đăng_ký_lần_đầu"
                label="Ngày đăng ký lần đầu (nếu có)"
              />
              <FormikTextField
                formik={formik}
                name="ngày_đăng_ký"
                label="Ngày đăng ký"
              />
              {isXeMay ? (
                <FormikTextField formik={formik} name="số_loại" label="Số loại" />
              ) : null}
              {isDauGia ? (
                <>
                  <FormikTextField
                    formik={formik}
                    name="số_bằng_chứng_trúng_đấu_giá"
                    label="Số giấy chứng nhận/quyết định"
                  />
                  <FormikTextField
                    formik={formik}
                    name="nơi_cấp_đấu_giá"
                    label="Nơi cấp đấu giá"
                  />
                  <FormikTextField
                    formik={formik}
                    name="ngày_trúng_đấu_giá"
                    label="Ngày trúng đấu giá"
                  />
                </>
              ) : null}
              <Divider sx={{ gridColumn: "span 3" }} />
              <Box
                sx={{ gridColumn: "span 3" }}
                display="flex"
                gap={2}
                flexDirection="column"
              >
                {isUyQuyen ? (
                  <>
                    <Typography variant="h6">Thời hạn uỷ quyền</Typography>
                    <FormikTextField
                      formik={formik}
                      name="thời_hạn"
                      label="Thời hạn"
                      onValueChange={(value, formik) => {
                        formik.setFieldValue(
                          "thời_hạn_bằng_chữ",
                          numberToVietnamese(
                            value?.replace(/\./g, "").replace(/\,/g, ".")
                          )?.toLocaleLowerCase()
                        );
                      }}
                    />
                    <Typography
                      sx={{ fontStyle: "italic" }}
                      color="text.secondary"
                    >
                      Bằng chữ: {formik.values["thời_hạn_bằng_chữ"]} năm
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">Giá trị tài sản</Typography>
                    <FormikTextField
                      formik={formik}
                      name="số_tiền"
                      label="Số tiền"
                      onValueChange={(value, formik) => {
                        formik.setFieldValue(
                          "số_tiền_bằng_chữ",
                          numberToVietnamese(
                            value?.replace(/\./g, "").replace(/\,/g, ".")
                          )
                        );
                      }}
                    />
                    <Typography
                      sx={{ fontStyle: "italic" }}
                      color="text.secondary"
                    >
                      Bằng chữ: {formik.values["số_tiền_bằng_chữ"]} đồng
                    </Typography>
                  </>
                )}
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
