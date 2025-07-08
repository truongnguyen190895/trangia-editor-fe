import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { AgreementObject as AgreementObjectModel } from "../../models/agreement-object";
import "./AgreementObject.css";

interface AgreementObjectFormData {
  objectNumber: string;
  objectMapNumber: string;
  address: string;
  certificateName: string;
  certificateNumber: string;
  certificateIssueNumber: string;
  certificateIssueBy: string;
  certificateIssueDate: Dayjs | null;
  detail: {
    square: number;
    purpose: string;
    validityPeriod: string;
    usageSource: string;
    note: string;
  };
  price: number;
}

const initialFormData: AgreementObjectFormData = {
  objectNumber: "",
  objectMapNumber: "",
  address: "",
  certificateName: "",
  certificateNumber: "",
  certificateIssueNumber: "",
  certificateIssueBy: "",
  certificateIssueDate: null,
  detail: {
    square: 0,
    purpose: "",
    validityPeriod: "",
    usageSource: "",
    note: "",
  },
  price: 0,
};

export const AgreementObject = () => {
  const [agreementObjects, setAgreementObjects] = useState<
    AgreementObjectModel[]
  >([]);
  const [formData, setFormData] =
    useState<AgreementObjectFormData>(initialFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof AgreementObjectFormData] as Record<
            string,
            any
          >),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.objectNumber || !formData.address) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        severity: "error",
      });
      return;
    }

    const newAgreementObject: AgreementObjectModel = {
      objectNumber: formData.objectNumber,
      objectMapNumber: formData.objectMapNumber,
      address: formData.address,
      certificateName: formData.certificateName,
      certificateNumber: formData.certificateNumber,
      certificateIssueNumber: formData.certificateIssueNumber,
      certificateIssueBy: formData.certificateIssueBy,
      certificateIssueDate:
        formData.certificateIssueDate?.format("YYYY-MM-DD") || "",
      detail: {
        square: formData.detail.square,
        purpose: formData.detail.purpose,
        validityPeriod: formData.detail.validityPeriod,
        usageSource: formData.detail.usageSource,
        note: formData.detail.note,
      },
      price: formData.price,
    };

    if (editingIndex !== null) {
      // Update existing object
      const updatedObjects = [...agreementObjects];
      updatedObjects[editingIndex] = newAgreementObject;
      setAgreementObjects(updatedObjects);
      setSnackbar({
        open: true,
        message: "Cập nhật đối tượng hợp đồng thành công",
        severity: "success",
      });
    } else {
      // Add new object
      setAgreementObjects((prev) => [...prev, newAgreementObject]);
      setSnackbar({
        open: true,
        message: "Thêm đối tượng hợp đồng thành công",
        severity: "success",
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (index: number) => {
    const object = agreementObjects[index];
    setFormData({
      objectNumber: object.objectNumber,
      objectMapNumber: object.objectMapNumber,
      address: object.address,
      certificateName: object.certificateName,
      certificateNumber: object.certificateNumber,
      certificateIssueNumber: object.certificateIssueNumber,
      certificateIssueBy: object.certificateIssueBy,
      certificateIssueDate: object.certificateIssueDate
        ? dayjs(object.certificateIssueDate)
        : null,
      detail: {
        square: object.detail.square,
        purpose: object.detail.purpose,
        validityPeriod: object.detail.validityPeriod,
        usageSource: object.detail.usageSource,
        note: object.detail.note,
      },
      price: object.price,
    });
    setEditingIndex(index);
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  const handleView = (index: number) => {
    const object = agreementObjects[index];
    setFormData({
      objectNumber: object.objectNumber,
      objectMapNumber: object.objectMapNumber,
      address: object.address,
      certificateName: object.certificateName,
      certificateNumber: object.certificateNumber,
      certificateIssueNumber: object.certificateIssueNumber,
      certificateIssueBy: object.certificateIssueBy,
      certificateIssueDate: object.certificateIssueDate
        ? dayjs(object.certificateIssueDate)
        : null,
      detail: {
        square: object.detail.square,
        purpose: object.detail.purpose,
        validityPeriod: object.detail.validityPeriod,
        usageSource: object.detail.usageSource,
        note: object.detail.note,
      },
      price: object.price,
    });
    setEditingIndex(index);
    setIsViewMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedObjects = agreementObjects.filter((_, i) => i !== index);
    setAgreementObjects(updatedObjects);
    setSnackbar({
      open: true,
      message: "Xóa đối tượng hợp đồng thành công",
      severity: "success",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsViewMode(false);
    setEditingIndex(null);
    setFormData(initialFormData);
  };

  const handleAddNew = () => {
    setFormData(initialFormData);
    setEditingIndex(null);
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  return (
    <Box className="agreement-object-container" sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quản lý đối tượng hợp đồng
        </Typography>
      </Box>

      {agreementObjects.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có đối tượng hợp đồng nào
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ mt: 2 }}
          >
            Thêm đối tượng đầu tiên
          </Button>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Số thửa đất</TableCell>
                <TableCell>Số bản đồ</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Giá (VNĐ)</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agreementObjects.map((object, index) => (
                <TableRow key={index}>
                  <TableCell>{object.objectNumber}</TableCell>
                  <TableCell>{object.objectMapNumber}</TableCell>
                  <TableCell>{object.address}</TableCell>
                  <TableCell>{object.price.toLocaleString("vi-VN")}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(index)} color="info">
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(index)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CRUD Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          {isViewMode
            ? "Xem chi tiết đối tượng hợp đồng"
            : editingIndex !== null
            ? "Chỉnh sửa đối tượng hợp đồng"
            : "Thêm mới đối tượng hợp đồng"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin cơ bản
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Số thửa đất *"
                  value={formData.objectNumber}
                  onChange={(e) =>
                    handleInputChange("objectNumber", e.target.value)
                  }
                  disabled={isViewMode}
                  required
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Số bản đồ"
                  value={formData.objectMapNumber}
                  onChange={(e) =>
                    handleInputChange("objectMapNumber", e.target.value)
                  }
                  disabled={isViewMode}
                />
              </Box>
              <TextField
                fullWidth
                label="Địa chỉ *"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={isViewMode}
                required
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Certificate Information */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin giấy chứng nhận
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Tên giấy chứng nhận"
                  value={formData.certificateName}
                  onChange={(e) =>
                    handleInputChange("certificateName", e.target.value)
                  }
                  disabled={isViewMode}
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Số giấy chứng nhận"
                  value={formData.certificateNumber}
                  onChange={(e) =>
                    handleInputChange("certificateNumber", e.target.value)
                  }
                  disabled={isViewMode}
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Số vào sổ GCN"
                  value={formData.certificateIssueNumber}
                  onChange={(e) =>
                    handleInputChange("certificateIssueNumber", e.target.value)
                  }
                  disabled={isViewMode}
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Nơi cấp"
                  value={formData.certificateIssueBy}
                  onChange={(e) =>
                    handleInputChange("certificateIssueBy", e.target.value)
                  }
                  disabled={isViewMode}
                />
                <Box sx={{ flex: "1 1 300px" }}>
                  <DatePicker
                    label="Ngày cấp"
                    value={formData.certificateIssueDate}
                    onChange={(date) =>
                      handleInputChange("certificateIssueDate", date)
                    }
                    disabled={isViewMode}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Detail Information */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Chi tiết thửa đất
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Diện tích (m²)"
                  type="number"
                  value={formData.detail.square}
                  onChange={(e) =>
                    handleInputChange("detail.square", Number(e.target.value))
                  }
                  disabled={isViewMode}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">m²</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Mục đích sử dụng"
                  value={formData.detail.purpose}
                  onChange={(e) =>
                    handleInputChange("detail.purpose", e.target.value)
                  }
                  disabled={isViewMode}
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Thời hạn sử dụng"
                  value={formData.detail.validityPeriod}
                  onChange={(e) =>
                    handleInputChange("detail.validityPeriod", e.target.value)
                  }
                  disabled={isViewMode}
                />
                <TextField
                  sx={{ flex: "1 1 300px" }}
                  label="Nguồn gốc sử dụng"
                  value={formData.detail.usageSource}
                  onChange={(e) =>
                    handleInputChange("detail.usageSource", e.target.value)
                  }
                  disabled={isViewMode}
                />
              </Box>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.detail.note}
                onChange={(e) =>
                  handleInputChange("detail.note", e.target.value)
                }
                disabled={isViewMode}
                multiline
                rows={3}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Price */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin giá
              </Typography>
              <TextField
                sx={{ flex: "1 1 300px" }}
                label="Giá (VNĐ)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", Number(e.target.value))
                }
                disabled={isViewMode}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {isViewMode ? "Đóng" : "Hủy"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSubmit} variant="contained">
              {editingIndex !== null ? "Cập nhật" : "Thêm mới"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
