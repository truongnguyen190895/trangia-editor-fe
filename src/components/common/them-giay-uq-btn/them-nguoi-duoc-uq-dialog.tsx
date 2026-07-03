import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sốGiấyTờSchema } from "@/utils/validate-id-number";
import { GENDER, type GiayUyQuyen } from "@/models/guq";
import {
  CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH,
  NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH,
} from "@/constants";

type NguoiDuocUQ = GiayUyQuyen["nguoi_duoc_uq"][number];

interface ThemNguoiDuocUQDialogProps {
  open: boolean;
  initialValue: NguoiDuocUQ | null;
  onClose: () => void;
  onSubmit: (value: NguoiDuocUQ) => void;
}

const EMPTY_VALUE: NguoiDuocUQ = {
  giới_tính: GENDER.MALE,
  tên: "",
  ngày_sinh: "",
  loại_giấy_tờ: "",
  số_giấy_tờ: "",
  nơi_cấp: "",
  ngày_cấp: "",
};

export const ThemNguoiDuocUQDialog = ({
  open,
  initialValue,
  onClose,
  onSubmit,
}: ThemNguoiDuocUQDialogProps) => {
  const isEdit = initialValue !== null;

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    useFormik<NguoiDuocUQ>({
      enableReinitialize: true,
      initialValues: initialValue ?? EMPTY_VALUE,
      validationSchema: Yup.object({
        giới_tính: Yup.string().required("Giới tính là bắt buộc"),
        tên: Yup.string().required("Tên là bắt buộc"),
        ngày_sinh: Yup.string().required("Ngày sinh là bắt buộc"),
        loại_giấy_tờ: Yup.string().required("Loại giấy tờ là bắt buộc"),
        số_giấy_tờ: sốGiấyTờSchema(),
        ngày_cấp: Yup.string().required("Ngày cấp là bắt buộc"),
        nơi_cấp: Yup.string().required("Nơi cấp là bắt buộc"),
      }),
      onSubmit: (v) => {
        onSubmit(v);
        onClose();
      },
    });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {isEdit ? "Sửa người được uỷ quyền" : "Thêm người được uỷ quyền"}
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr"
            gap="10px"
            mt="1rem"
          >
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Giới tính *</FormLabel>
              <Select
                value={values["giới_tính"] || ""}
                name="giới_tính"
                onChange={handleChange}
              >
                <MenuItem value={GENDER.MALE}>{GENDER.MALE}</MenuItem>
                <MenuItem value={GENDER.FEMALE}>{GENDER.FEMALE}</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Tên *</FormLabel>
              <TextField
                value={values.tên}
                name="tên"
                fullWidth
                error={!!errors.tên && touched.tên}
                helperText={touched.tên && errors.tên}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày sinh *</FormLabel>
              <TextField
                value={values["ngày_sinh"]}
                name="ngày_sinh"
                fullWidth
                error={!!errors["ngày_sinh"] && touched["ngày_sinh"]}
                helperText={touched["ngày_sinh"] && errors["ngày_sinh"]}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Số giấy tờ *</FormLabel>
              <TextField
                value={values["số_giấy_tờ"]}
                name="số_giấy_tờ"
                onChange={handleChange}
                fullWidth
                error={!!errors["số_giấy_tờ"] && touched["số_giấy_tờ"]}
                helperText={touched["số_giấy_tờ"] && errors["số_giấy_tờ"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Loại giấy tờ *</FormLabel>
              <Autocomplete
                freeSolo
                options={CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                value={values["loại_giấy_tờ"] || ""}
                onChange={(_, newValue) =>
                  setFieldValue("loại_giấy_tờ", (newValue as string) || "")
                }
                onInputChange={(_, newInputValue) =>
                  setFieldValue("loại_giấy_tờ", newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors["loại_giấy_tờ"] && touched["loại_giấy_tờ"]}
                    helperText={
                      (touched["loại_giấy_tờ"] && errors["loại_giấy_tờ"]) || ""
                    }
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày cấp *</FormLabel>
              <TextField
                value={values["ngày_cấp"]}
                name="ngày_cấp"
                onChange={handleChange}
                fullWidth
                error={!!errors["ngày_cấp"] && touched["ngày_cấp"]}
                helperText={touched["ngày_cấp"] && errors["ngày_cấp"]}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px", gridColumn: "span 2" }}>
              <FormLabel>Nơi cấp *</FormLabel>
              <Autocomplete
                freeSolo
                options={NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH.map((o) => o.value)}
                value={values["nơi_cấp"] || ""}
                onChange={(_, newValue) =>
                  setFieldValue("nơi_cấp", (newValue as string) || "")
                }
                onInputChange={(_, newInputValue) =>
                  setFieldValue("nơi_cấp", newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors["nơi_cấp"] && touched["nơi_cấp"]}
                    helperText={(touched["nơi_cấp"] && errors["nơi_cấp"]) || ""}
                  />
                )}
              />
            </FormControl>
          </Box>
          <input type="submit" hidden />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button variant="contained" onClick={() => handleSubmit()}>
          {isEdit ? "Lưu" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
