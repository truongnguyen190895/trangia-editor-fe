import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ThongTinTaiSan } from "@/models/hdcn-dat-va-tsglvd";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";
import { numberToVietnamese } from "@/utils/number-to-words";

interface ThongTinTaiSanProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object({
  thông_tin_tài_sản: Yup.string().required("Thông tin tài sản là bắt buộc"),
  diện_tích_xây_dựng: Yup.string().required("Diện tích xây dựng là bắt buộc"),
  số_tiền: Yup.string().required("Số tiền là bắt buộc"),
  số_tiền_bằng_chữ: Yup.string().required("Số tiền bằng chữ là bắt buộc"),
});

export const ThongTinTaiSanDialog = ({
  open,
  handleClose,
}: ThongTinTaiSanProps) => {
  const { taiSan, addTaiSan } = useHDMBTaiSanContext();

  const submitForm = (values: ThongTinTaiSan) => {
    addTaiSan(values);
    handleClose();
  };

  const getInitialValue = (): ThongTinTaiSan => {
    return taiSan
      ? taiSan
      : {
          thông_tin_tài_sản: "",
          số_tiền: "",
          số_tiền_bằng_chữ: "",
          diện_tích_xây_dựng: "",
        };
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useFormik<ThongTinTaiSan>({
      initialValues: getInitialValue(),
      validationSchema,
      onSubmit: submitForm,
    });

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin tài sản gắn liền với đất</DialogTitle>
        <DialogContent>
          <Box sx={{ py: "20px" }}>
            <TextField
              fullWidth
              label="Tên tài sản"
              name="thông_tin_tài_sản"
              id="thông_tin_tài_sản"
              value={values.thông_tin_tài_sản}
              onChange={handleChange}
              error={!!errors.thông_tin_tài_sản}
              helperText={errors.thông_tin_tài_sản}
            />
            <TextField
              sx={{ mt: "20px" }}
              fullWidth
              label="Diện tích xây dựng (m2)"
              name="diện_tích_xây_dựng"
              id="diện_tích_xây_dựng"
              onChange={handleChange}
              value={values.diện_tích_xây_dựng}
              error={!!errors.diện_tích_xây_dựng}
              helperText={errors.diện_tích_xây_dựng}
            />
            <Typography
              variant="body1"
              fontSize="1.5rem"
              fontWeight="600"
              mt="20px"
            >
              Giá trị hợp đồng
            </Typography>
            <Box
              mt="20px"
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              <TextField
                fullWidth
                id="số_tiền"
                name="số_tiền"
                label="Số tiền *"
                value={values.số_tiền}
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue(
                    "số_tiền_bằng_chữ",
                    numberToVietnamese(
                      e.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                    )
                  );
                }}
                helperText={errors.số_tiền}
                error={!!errors.số_tiền}
              />
              <TextField
                fullWidth
                id="số_tiền_bằng_chữ"
                name="số_tiền_bằng_chữ"
                label="Số tiền bằng chữ"
                value={values.số_tiền_bằng_chữ}
                onChange={handleChange}
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
