import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { SingleAgreementParty } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";

interface AddSingleDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddSingleDialog = ({ open, onClose }: AddSingleDialogProps) => {
  const { values, handleChange, handleSubmit } =
    useFormik<SingleAgreementParty>({
      initialValues: {
        "giới tính": GENDER.MALE,
        tên: "",
        "ngày sinh": "",
        "loại giấy tờ": "",
        "số giấy tờ": "",
        "ngày cấp": "",
        "nơi cấp": "",
        "địa chỉ thường trú cũ": "",
        "địa chỉ thường trú mới": "",
      },
      validationSchema: Yup.object({
        "giới tính": Yup.string().required("Giới tính là bắt buộc"),
        tên: Yup.string().required("Tên là bắt buộc"),
        "ngày sinh": Yup.string().required("Ngày sinh là bắt buộc"),
        "loại giấy tờ": Yup.string().required("Loại giấy tờ là bắt buộc"),
      }),
      onSubmit: (values) => {
        console.log(values);
      },
    });

  console.log("values", values);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h6">Thêm thông tin cá nhân</Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="10px">
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Giới tính *</FormLabel>
              <Select
                value={values["giới tính"] || ""}
                name="giới tính"
                onChange={handleChange}
              >
                <MenuItem value="Ông">Ông</MenuItem>
                <MenuItem value="Bà">Bà</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Tên *</FormLabel>
              <TextField
                value={values.tên}
                name="tên"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày sinh *</FormLabel>
              <TextField
                value={values["ngày sinh"]}
                name="ngày sinh"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Loại giấy tờ *</FormLabel>
              <Select
                value={values["loại giấy tờ"]}
                name="loại giấy tờ"
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="CCCD">CCCD</MenuItem>
                <MenuItem value="CMND">CMND</MenuItem>
                <MenuItem value="Hộ chiếu">Hộ chiếu</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Số giấy tờ *</FormLabel>
              <TextField
                value={values["số giấy tờ"]}
                name="số giấy tờ"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Ngày cấp *</FormLabel>
              <TextField
                value={values["ngày cấp"]}
                name="ngày cấp"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Nơi cấp *</FormLabel>
              <TextField
                value={values["nơi cấp"]}
                name="nơi cấp"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Địa chỉ thường trú cũ *</FormLabel>
              <TextField
                value={values["địa chỉ thường trú cũ"]}
                name="địa chỉ thường trú cũ"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px" }}>
              <FormLabel>Địa chỉ thường trú mới *</FormLabel>
              <TextField
                value={values["địa chỉ thường trú mới"]}
                name="địa chỉ thường trú mới"
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: "10px", gridColumn: "span 3" }}>
              <FormLabel>Tình trạng hôn nhân</FormLabel>
              <TextField
                value={values["tình trạng hôn nhân"]}
                name="tình trạng hôn nhân"
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </FormControl>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button type="submit" variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
