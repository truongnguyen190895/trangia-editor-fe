import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
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

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik<ThongTinXeOto>({
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
        <DialogTitle>Thêm thông tin xe {isXeMay ? "máy" : "ô tô"}</DialogTitle>
        <DialogContent>
          <SearchEntity placeholder="Nhập số khung" onSearch={handleSearch} />
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="nhãn_hiệu"
                name="nhãn_hiệu"
                label="Nhãn hiệu"
                value={values["nhãn_hiệu"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="màu_sơn"
                name="màu_sơn"
                label="Màu sơn"
                value={values["màu_sơn"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="loại_xe"
                name="loại_xe"
                label="Loại xe"
                value={values["loại_xe"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="số_máy"
                name="số_máy"
                label="Số máy"
                value={values["số_máy"]}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                id="số_khung"
                name="số_khung"
                label="Số khung *"
                value={values["số_khung"]}
                onChange={handleChange}
                error={!!errors["số_khung"] && touched["số_khung"]}
                helperText={
                  errors["số_khung"] &&
                  touched["số_khung"] &&
                  errors["số_khung"]
                }
              />
              <TextField
                fullWidth
                id="biển_số"
                name="biển_số"
                label="Biển số"
                value={values["biển_số"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="số_đăng_ký"
                name="số_đăng_ký"
                label="Số đăng ký"
                value={values["số_đăng_ký"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                id="nơi_cấp"
                name="nơi_cấp"
                label="Nơi cấp"
                value={values["nơi_cấp"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="ngày_đăng_ký_lần_đầu"
                name="ngày_đăng_ký_lần_đầu"
                label="Ngày đăng ký lần đầu (nếu có)"
                value={values["ngày_đăng_ký_lần_đầu"]}
                onChange={handleChange}
                error={
                  !!errors["ngày_đăng_ký_lần_đầu"] &&
                  touched["ngày_đăng_ký_lần_đầu"]
                }
                helperText={
                  errors["ngày_đăng_ký_lần_đầu"] &&
                  touched["ngày_đăng_ký_lần_đầu"] &&
                  errors["ngày_đăng_ký_lần_đầu"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="ngày_đăng_ký"
                name="ngày_đăng_ký"
                label="Ngày đăng ký"
                value={values["ngày_đăng_ký"]}
                onChange={handleChange}
              />
              {isXeMay ? (
                <TextField
                  fullWidth
                  type="text"
                  id="số_loại"
                  name="số_loại"
                  label="Số loại"
                  value={values["số_loại"]}
                  onChange={handleChange}
                />
              ) : null}
              {isDauGia ? (
                <>
                  <TextField
                    fullWidth
                    type="text"
                    id="số_bằng_chứng_trúng_đấu_giá"
                    name="số_bằng_chứng_trúng_đấu_giá"
                    label="Số giấy chứng nhận/quyết định"
                    value={values["số_bằng_chứng_trúng_đấu_giá"]}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="text"
                    id="nơi_cấp_đấu_giá"
                    name="nơi_cấp_đấu_giá"
                    label="Nơi cấp đấu giá"
                    value={values["nơi_cấp_đấu_giá"]}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="text"
                    id="ngày_trúng_đấu_giá"
                    name="ngày_trúng_đấu_giá"
                    label="Ngày trúng đấu giá"
                    value={values["ngày_trúng_đấu_giá"]}
                    onChange={handleChange}
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
                    <TextField
                      fullWidth
                      id="thời_hạn"
                      name="thời_hạn"
                      label="Thời hạn"
                      value={values["thời_hạn"]}
                      onChange={(event) => {
                        handleChange(event);
                        setFieldValue(
                          "thời_hạn_bằng_chữ",
                          numberToVietnamese(
                            event.target.value
                              ?.replace(/\./g, "")
                              .replace(/\,/g, ".")
                          )?.toLocaleLowerCase()
                        );
                      }}
                    />
                    <Typography
                      sx={{ fontStyle: "italic" }}
                      color="text.secondary"
                    >
                      Bằng chữ: {values["thời_hạn_bằng_chữ"]} năm
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">Giá trị tài sản</Typography>
                    <TextField
                      fullWidth
                      id="số_tiền"
                      name="số_tiền"
                      label="Số tiền"
                      value={values["số_tiền"]}
                      onChange={(event) => {
                        handleChange(event);
                        setFieldValue(
                          "số_tiền_bằng_chữ",
                          numberToVietnamese(
                            event.target.value
                              ?.replace(/\./g, "")
                              .replace(/\,/g, ".")
                          )
                        );
                      }}
                    />
                    <Typography
                      sx={{ fontStyle: "italic" }}
                      color="text.secondary"
                    >
                      Bằng chữ: {values["số_tiền_bằng_chữ"]} đồng
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
