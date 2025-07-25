import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { numberToVietnamese } from "@/utils/number-to-words";
import type { ThongTinNhaDat } from "@/models/hdmb-nha-dat";
import { useHDMBNhaDatContext } from "@/context/hdmb-nha-dat";

interface ThongTinNhaDatProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  diện_tích_xây_dựng: Yup.string().required("Diện tích xây dựng là bắt buộc"),
  diện_tích_sàn: Yup.string().required("Diện tích sàn là bắt buộc"),
  số_tiền: Yup.string().required("Số tiền là bắt buộc"),
  số_tiền_bằng_chữ: Yup.string().required("Số tiền bằng chữ là bắt buộc"),
  ghi_chú: Yup.string().nullable(),
  hình_thức_sở_hữu: Yup.string().required("Hình thức sở hữu là bắt buộc"),
});

export const ThongTinNhaDatDialog = ({
  open,
  handleClose,
}: ThongTinNhaDatProps) => {
  const { nhaDat, addNhaDat } = useHDMBNhaDatContext();

  const submitForm = (values: ThongTinNhaDat) => {
    addNhaDat(values);
    handleClose();
  };

  const getInitialValue = (): ThongTinNhaDat => {
    return nhaDat
      ? nhaDat
      : {
          diện_tích_xây_dựng: "",
          diện_tích_sàn: "",
          số_tầng: "",
          kết_cấu: null,
          cấp_hạng: null,
          năm_hoàn_thành_xây_dựng: null,
          số_tiền: "",
          số_tiền_bằng_chữ: "",
          ghi_chú: "",
          loại_nhà_ở: "",
          hình_thức_sở_hữu: "",
        };
  };

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    useFormik<ThongTinNhaDat>({
      initialValues: getInitialValue(),
      validationSchema,
      onSubmit: submitForm,
    });

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin nhà đất</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                fullWidth
                id="diện_tích_xây_dựng"
                name="diện_tích_xây_dựng"
                label="Diện tích xây dựng (m2)*"
                value={values["diện_tích_xây_dựng"]}
                onChange={handleChange}
                error={
                  !!errors["diện_tích_xây_dựng"] &&
                  touched["diện_tích_xây_dựng"]
                }
                helperText={
                  errors["diện_tích_xây_dựng"] &&
                  touched["diện_tích_xây_dựng"] &&
                  errors["diện_tích_xây_dựng"]
                }
              />
              <TextField
                fullWidth
                id="diện_tích_sàn"
                name="diện_tích_sàn"
                label="Diện tích sàn (m2)*"
                value={values["diện_tích_sàn"]}
                onChange={handleChange}
                error={!!errors["diện_tích_sàn"] && touched["diện_tích_sàn"]}
                helperText={
                  errors["diện_tích_sàn"] &&
                  touched["diện_tích_sàn"] &&
                  errors["diện_tích_sàn"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="số_tầng"
                name="số_tầng"
                label="Số tầng"
                value={values["số_tầng"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="kết_cấu"
                name="kết_cấu"
                label="Kết cấu"
                value={values["kết_cấu"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="cấp_hạng"
                name="cấp_hạng"
                label="Cấp hạng"
                value={values["cấp_hạng"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="năm_hoàn_thành_xây_dựng"
                name="năm_hoàn_thành_xây_dựng"
                label="Năm hoàn thành xây dựng"
                value={values["năm_hoàn_thành_xây_dựng"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="số_tiền"
                name="số_tiền"
                label="Số tiền *"
                value={values["số_tiền"]}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue(
                    "số_tiền_bằng_chữ",
                    numberToVietnamese(
                      event.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
                error={!!errors["số_tiền"] && touched["số_tiền"]}
                helperText={
                  errors["số_tiền"] && touched["số_tiền"] && errors["số_tiền"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="số_tiền_bằng_chữ"
                name="số_tiền_bằng_chữ"
                label="Số tiền bằng chữ *"
                value={values["số_tiền_bằng_chữ"]}
                onChange={handleChange}
                error={
                  !!errors["số_tiền_bằng_chữ"] && touched["số_tiền_bằng_chữ"]
                }
                helperText={
                  errors["số_tiền_bằng_chữ"] &&
                  touched["số_tiền_bằng_chữ"] &&
                  errors["số_tiền_bằng_chữ"]
                }
              />
              <TextField
                fullWidth
                type="text"
                id="loại_nhà_ở"
                name="loại_nhà_ở"
                label="Loại nhà ở"
                value={values["loại_nhà_ở"]}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="text"
                id="hình_thức_sở_hữu"
                name="hình_thức_sở_hữu"
                label="Hình thức sở hữu"
                value={values["hình_thức_sở_hữu"]}
                onChange={handleChange}
                error={!!errors["hình_thức_sở_hữu"] && touched["hình_thức_sở_hữu"]}
                helperText={
                  errors["hình_thức_sở_hữu"] &&
                  touched["hình_thức_sở_hữu"] &&
                  errors["hình_thức_sở_hữu"]
                }
              />
              <TextField
                sx={{ gridColumn: "span 3" }}
                fullWidth
                type="text"
                multiline
                rows={4}
                id="ghi_chú"
                name="ghi_chú"
                label="Ghi chú"
                value={values["ghi_chú"]}
                onChange={handleChange}
                error={!!errors["ghi_chú"] && touched["ghi_chú"]}
                helperText={
                  errors["ghi_chú"] && touched["ghi_chú"] && errors["ghi_chú"]
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" type="submit">
            Thêm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
