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
import type { ThongTinTaiSan } from "@/models/hdmb-tai-san";
import { useHDMBTaiSanContext } from "@/context/hdmb-tai-san";
import { numberToVietnamese } from "@/utils/number-to-words";
import { SearchEntity } from "@/components/common/search-entity";
import { checkIsObjectEmpty } from "@/utils/common";

interface ThongTinTaiSanProps {
  open: boolean;
  handleClose: () => void;
}

export const ThongTinTaiSanDialog = ({
  open,
  handleClose,
}: ThongTinTaiSanProps) => {
  const { taiSan, addTaiSan } = useHDMBTaiSanContext();

  const submitForm = (values: ThongTinTaiSan) => {
    const allEmpty = checkIsObjectEmpty(values);
    if (allEmpty) {
      handleClose();
      return;
    }
    addTaiSan(values);
    handleClose();
  };

  const getInitialValue = (): ThongTinTaiSan => {
    return taiSan
      ? taiSan
      : {
          tên_tài_sản: "",
          diện_tích_sử_dụng: "",
          hình_thức_sở_hữu: "",
          số_tiền: "",
          số_tiền_bằng_chữ: "",
        };
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik<ThongTinTaiSan>({
    initialValues: getInitialValue(),
    onSubmit: submitForm,
  });

  const handleSearch = (response: any) => {
    if (response) {
      setValues({
        ...values,
        tên_tài_sản: response?.tên_tài_sản,
        diện_tích_sử_dụng: response?.diện_tích_sử_dụng,
        hình_thức_sở_hữu: response?.hình_thức_sở_hữu,
        số_tiền: response?.số_tiền,
        số_tiền_bằng_chữ: response?.số_tiền_bằng_chữ,
      });
    }
  };
  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Thêm thông tin tài sản gắn liền với đất</DialogTitle>
        <DialogContent>
          <SearchEntity
            placeholder="Nhập số giấy tờ (số sổ)"
            onSearch={handleSearch}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "15px",
            }}
            py="20px"
          >
            <TextField
              fullWidth
              label="Tên tài sản"
              name="tên_tài_sản"
              id="tên_tài_sản"
              value={values.tên_tài_sản}
              onChange={handleChange}
              error={!!errors.tên_tài_sản}
              helperText={errors.tên_tài_sản}
            />
            <TextField
              fullWidth
              label="Diện tích sử dụng (m2)"
              name="diện_tích_sử_dụng"
              id="diện_tích_sử_dụng"
              onChange={handleChange}
              value={values.diện_tích_sử_dụng}
              error={!!errors.diện_tích_sử_dụng}
              helperText={errors.diện_tích_sử_dụng}
            />
            <TextField
              fullWidth
              label="Hình thức sở hữu"
              name="hình_thức_sở_hữu"
              id="hình_thức_sở_hữu"
              onChange={handleChange}
              value={values.hình_thức_sở_hữu}
              error={!!errors.hình_thức_sở_hữu}
              helperText={errors.hình_thức_sở_hữu}
            />
            <Box sx={{ gridColumn: "span 3" }}>
              <Typography variant="h6">
                Giá trị chuyển nhượng, mua bán
              </Typography>
              <Box display="flex" flexDirection="column" gap="10px" mt="20px">
                <TextField
                  fullWidth
                  label="Số tiền"
                  name="số_tiền"
                  id="số_tiền"
                  value={values.số_tiền}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue(
                      "số_tiền_bằng_chữ",
                      numberToVietnamese(
                        e.target.value?.replace(/\./g, "").replace(/\,/g, ".")
                      )?.toLocaleLowerCase()
                    );
                  }}
                />
                <Typography sx={{ fontStyle: "italic" }} color="text.secondary">
                  Bằng chữ: {values.số_tiền_bằng_chữ} VND
                </Typography>
              </Box>
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
