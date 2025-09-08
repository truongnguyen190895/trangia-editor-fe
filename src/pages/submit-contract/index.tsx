import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { BRANCHES } from "@/constants/branches";
import { CONTRACT_TYPES } from "@/constants/contract-types";
import { useFormik } from "formik";
import { submitContract, getTheNextAvailableId } from "@/api/contract";
import { render_phieu_thu, type PhieuThuPayload } from "@/api";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import * as yup from "yup";
import dayjs from "dayjs";
import { numberToVietnamese } from "@/utils/number-to-words";

const validationSchema = yup.object({
  unit: yup.string(),
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
  const [checkingLoading, setCheckingLoading] = useState(false);
  const [type, setType] = useState<string>("Contract");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [nextAvailableId, setNextAvailableId] = useState<string>("");
  const [createdContractNumber, setCreatedContractNumber] =
    useState<string>("");

  useEffect(() => {
    setCheckingLoading(true);
    getTheNextAvailableId(type)
      .then((resp) => {
        setNextAvailableId(resp);
        setFieldValue("id", resp);
      })
      .catch(() => {
        setErrorMessage("Có lỗi khi kiểm tra số hợp đồng");
      })
      .finally(() => {
        setCheckingLoading(false);
      });
  }, [type, errorMessage]);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCloseError = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const {
    values,
    errors,
    resetForm,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik<InitialValues>({
    validationSchema,
    initialValues: {
      id: "",
      name: "",
      customer: "",
      broker: "",
      value: 0,
      copiesValue: 0,
      notes: "",
      unit: "HĐ",
      relationship: "",
      nationalId: "",
    },
    onSubmit: (formValues) => {
      setIsLoading(true);
      const payload = {
        ...formValues,
        customer: formValues.customer?.trim(),
      };
      const phieuThuPayload: PhieuThuPayload = {
        d: dayjs().format("DD"),
        m: dayjs().format("MM"),
        y: dayjs().format("YYYY"),
        người_nộp_tiền: formValues.customer,
        lý_do_nộp: "Phí cc theo hợp đồng số " + formValues.id,
        số_tiền: (
          Number(formValues.value * 1000) +
          Number(formValues.copiesValue * 1000)
        ).toLocaleString(),
        số_tiền_bằng_chữ: numberToVietnamese(
          (Number(formValues.value * 1000) + Number(formValues.copiesValue * 1000))
            .toString()
            .replace(/\./g, "")
            .replace(/\,/g, ".")
        ),
      };
      submitContract(payload)
        .then((resp) => {
          setOpen(true);
          setCreatedContractNumber(resp.id);
          resetForm();
        })
        .catch((err) => {
          if (err?.status === 400) {
            setErrorMessage(
              "Đã có người sử dụng số hợp đồng này, vui lòng lấy số hợp đồng khác"
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      render_phieu_thu(phieuThuPayload).then((resp) => {
        const blob = new Blob([resp.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mau-phieu-thu-tt200.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    },
  });
  return (
    <Box>
      <Typography variant="h4">Lấy số hợp đồng</Typography>
      <Box mt="2rem">
        <Typography variant="h5">Nhập thông tin</Typography>
        <Box mt="1rem">
          <Typography>Chọn loại hình công chứng</Typography>
          <Select
            sx={{ width: "300px", marginTop: "1rem" }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Contract">Công chứng Hợp Đồng</MenuItem>
            <MenuItem value="Signature">Chứng thực chữ ký</MenuItem>
          </Select>
        </Box>
        <Box mt="1rem">
          <Box mb="2rem">
            <Typography variant="h5">
              Số hợp đồng sẵn sàng để lấy:{" "}
              <strong style={{ color: "green" }}>
                {checkingLoading ? "Đang kiểm tra..." : nextAvailableId}
              </strong>
            </Typography>
            <Typography color="red">
              <strong>Lưu ý:</strong> Số tiền nhập theo dạng rút gọn, ví dụ: 500
              = 500,000
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gridTemplateColumns="repeat(4, 1fr)"
              gap="20px"
              mt="1rem"
            >
              <FormControl>
                <InputLabel htmlFor="unit">Đơn vị</InputLabel>
                <Select
                  id="unit"
                  name="unit"
                  label="Đơn vị"
                  value={values.unit}
                  onChange={handleChange}
                >
                  {BRANCHES.map((branch) => (
                    <MenuItem key={branch.id} value={branch.value}>
                      {branch.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Số hợp đồng"
                name="id"
                value={values.id}
                onChange={handleChange}
                error={!!errors.id}
                helperText={errors.id}
              />
              <FormControl>
                <InputLabel htmlFor="unit">Tên Hợp Đồng</InputLabel>
                <Select
                  id="ten"
                  name="name"
                  label="Tên Hợp Đồng"
                  value={values.name}
                  onChange={handleChange}
                >
                  {CONTRACT_TYPES.map((branch) => (
                    <MenuItem key={branch.id} value={branch.value}>
                      {branch.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                placeholder="Vd: 100 = 100,000"
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
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubmitContract;
