import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { submitContract, getTheNextAvailableId } from "@/api/contract";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  unit: yup.string().required("Đơn vị là bắt buộc"),
  id: yup.string().required("Số hợp đồng là bắt buộc"),
  name: yup.string().required("Tên hợp đồng là bắt buộc"),
  customer: yup.string().required("Tên khách hàng là bắt buộc"),
  broker: yup.string(),
  value: yup.number().required("Số tiền là bắt buộc"),
  copiesValue: yup.number(),
  notes: yup.string(),
  nationalId: yup.string(),
});

interface InitialValues {
  id: string;
  name: string;
  customer: string;
  broker: string;
  value: number;
  copiesValue: number;
  notes: string;
  unit: string;
  relationship: string;
  nationalId: string;
}

const SubmitContract = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextAvailableId, setNextAvailableId] = useState<string>("");
  const [createdContractNumber, setCreatedContractNumber] =
    useState<string>("");

  useEffect(() => {
    getTheNextAvailableId().then((resp) => {
      setNextAvailableId(resp);
      setFieldValue("id", resp);
    });
  }, []);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const { values, errors, resetForm, handleChange, handleSubmit, setFieldValue } =
    useFormik<InitialValues>({
      validationSchema,
      initialValues: {
        id: "",
        name: "",
        customer: "",
        broker: "",
        value: 0,
        copiesValue: 0,
        notes: "",
        unit: "",
        relationship: "",
        nationalId: "",
      },
      onSubmit: (values) => {
        setIsLoading(true);
        submitContract(values)
          .then((resp) => {
            setOpen(true);
            setCreatedContractNumber(resp.id);
            resetForm();
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
    });
  return (
    <Box>
      <Typography variant="h4">Lấy số hợp đồng</Typography>
      <Box mt="2rem">
        <Typography variant="h5">Nhập thông tin</Typography>
        <Box mt="1rem">
          <Typography variant="h5" fontWeight="600" color="green">
            Số hợp đồng sẵn sàng để lấy: {nextAvailableId}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px" mt="1rem">
              <TextField
                label="Đơn vị"
                name="unit"
                value={values.unit}
                onChange={handleChange}
                error={!!errors.unit}
                helperText={errors.unit}
              />
              <TextField
                label="Số hợp đồng"
                name="id"
                value={values.id}
                onChange={handleChange}
                error={!!errors.id}
                helperText={errors.id}
              />
              <TextField
                label="Tên hợp đồng"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Tên khách hàng"
                name="customer"
                value={values.customer}
                onChange={handleChange}
                error={!!errors.customer}
                helperText={errors.customer}
              />
              <TextField
                label="Số CCCD"
                name="nationalId"
                value={values.nationalId}
                onChange={handleChange}
                error={!!errors.nationalId}
                helperText={errors.nationalId}
              />
              <TextField
                label="Số tiền công chứng"
                name="value"
                placeholder="Vd: 500000"
                value={values.value}
                onChange={handleChange}
                error={!!errors.value}
                helperText={errors.value}
              />
              <TextField
                label="Số tiền làm bản sao"
                name="copiesValue"
                value={values.copiesValue}
                onChange={handleChange}
                error={!!errors.copiesValue}
                helperText={errors.copiesValue}
              />
              <TextField
                label="Quan hệ"
                name="broker"
                value={values.broker}
                onChange={handleChange}
                error={!!errors.broker}
                helperText={errors.broker}
              />
              <TextField
                label="Ghi chú"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                error={!!errors.notes}
                helperText={errors.notes}
              />
            </Box>
            <Box mt="1rem">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  width: "200px",
                  height: "40px",
                }}
              >
                {isLoading ? <CircularProgress size={20} /> : "Lưu thông tin"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Lưu thành công số hợp đồng {createdContractNumber}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubmitContract;
