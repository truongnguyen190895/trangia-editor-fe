import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { submitContract } from "@/api/contract";
import type { SubmitContractPayload } from "@/api/contract";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  contractType: yup.string().required("Loại hợp đồng là bắt buộc"),
  customerName: yup.string().required("Tên khách hàng là bắt buộc"),
  price: yup.string().required("Số tiền là bắt buộc"),
  priceForMakingCopy: yup.string().required("Số tiền làm bản sao là bắt buộc"),
  referee: yup.string().required("Môi giới là bắt buộc"),
});

const SubmitContract = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdContractNumber, setCreatedContractNumber] =
    useState<string>("");

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const { values, errors, resetForm, handleChange, handleSubmit } = useFormik({
    validationSchema,
    initialValues: {
      contractType: "",
      customerName: "",
      price: "",
      priceForMakingCopy: "",
      referee: "",
    },
    onSubmit: (values) => {
      const payload: SubmitContractPayload = {
        name: values.contractType,
        customer: values.customerName,
        broker: values.referee,
        value: Number(values.price),
        copiesValue: Number(values.priceForMakingCopy),
      };
      setIsLoading(true);
      submitContract(payload)
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
          <form onSubmit={handleSubmit}>
            <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap="10px">
              <TextField
                label="Loại hợp đồng"
                name="contractType"
                value={values.contractType}
                onChange={handleChange}
                error={!!errors.contractType}
                helperText={errors.contractType}
              />
              <TextField
                label="Tên khách hàng"
                name="customerName"
                value={values.customerName}
                onChange={handleChange}
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
              <TextField
                label="Số tiền công chứng"
                name="price"
                placeholder="Vd: 500000"
                value={values.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
              />
              <TextField
                label="Số tiền làm bản sao"
                name="priceForMakingCopy"
                value={values.priceForMakingCopy}
                onChange={handleChange}
                error={!!errors.priceForMakingCopy}
                helperText={errors.priceForMakingCopy}
              />
              <TextField
                label="Môi giới"
                name="referee"
                value={values.referee}
                onChange={handleChange}
                error={!!errors.referee}
                helperText={errors.referee}
              />
            </Box>
            <Box mt="1rem">
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "green", width: "200px", height: '40px' }}
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
