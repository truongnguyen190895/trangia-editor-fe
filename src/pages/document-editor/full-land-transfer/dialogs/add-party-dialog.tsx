import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import type { AgreementEntity } from "@/models/agreement-entity";
import { GENDER } from "@/models/agreement-entity";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AddPartyDialogProps {
  open: boolean;
  initialEntity: AgreementEntity | null;
  handleClose: () => void;
  onCreate: (values: AgreementEntity) => void;
}

export const AddPartyDialog = ({
  open,
  initialEntity,
  handleClose,
  onCreate,
}: AddPartyDialogProps) => {
  const initialValues: AgreementEntity = initialEntity || {
    gender: GENDER.MALE,
    name: "",
    dateOfBirth: "",
    documentType: "",
    documentNumber: "",
    documentIssuedDate: "",
    documentIssuedBy: "",
    address: "",
  };

  const { values, errors, touched, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Họ và tên là bắt buộc"),
      dateOfBirth: Yup.string().required("Ngày sinh là bắt buộc"),
      documentType: Yup.string().required("Loại giấy tờ là bắt buộc"),
      documentNumber: Yup.string().required("Số giấy tờ là bắt buộc"),
      documentIssuedDate: Yup.string().required("Ngày cấp là bắt buộc"),
      documentIssuedBy: Yup.string().required("Nơi cấp là bắt buộc"),
      address: Yup.string().required("Địa chỉ thường trú là bắt buộc"),
    }),
    onSubmit: (values) => {
      onCreate(values);
    },
  });

  const handleCloseDialog = () => {
    handleClose();
    resetForm();
  };

  const handleSubmitForm = () => {
    handleSubmit();
    // handleCloseDialog();
  };

  console.log("rendering... ", errors);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm bên chuyển nhượng</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Ông/Bà *</InputLabel>
              <Select
                value={values.gender || ""}
                label="Ông/Bà *"
                name="gender"
                onChange={handleChange}
              >
                <MenuItem value="Ông">Ông</MenuItem>
                <MenuItem value="Bà">Bà</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="name"
              label="Họ và tên *"
              error={!!errors.name && touched.name}
              helperText={errors.name && touched.name && errors.name}
              value={values.name}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Ngày sinh *"
              fullWidth
              type="date"
              name="dateOfBirth"
              value={values.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Loại giấy tờ *</InputLabel>
              <Select
                value={values.documentType}
                label="Loại giấy tờ *"
                name="documentType"
                onChange={handleChange}
              >
                <MenuItem value="CMND">CMND</MenuItem>
                <MenuItem value="CCCD">CCCD</MenuItem>
                <MenuItem value="Hộ chiếu">Hộ chiếu</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Số giấy tờ *"
              name="documentNumber"
              value={values.documentNumber}
              onChange={handleChange}
            />
            <TextField
              label="Ngày cấp *"
              fullWidth
              type="date"
              name="documentIssuedDate"
              value={values.documentIssuedDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Nơi cấp"
              name="documentIssuedBy"
              value={values.documentIssuedBy}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Địa chỉ thường trú"
              name="address"
              value={values.address}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmitForm}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
