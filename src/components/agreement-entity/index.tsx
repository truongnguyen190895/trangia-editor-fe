import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import type { AgreementEntity as AgreementEntityModel } from "../../models/agreement-entity";
import { GENDER } from "../../models/agreement-entity";

interface AgreementEntityProps {
  title: string;
  agreementEntities: AgreementEntityModel[];
  onEntitiesChange?: (entities: AgreementEntityModel[]) => void;
}

const initialFormData: AgreementEntityModel = {
  gender: GENDER.MALE,
  dateOfBirth: "",
  name: "",
  address: "",
  documentType: "",
  documentNumber: "",
  documentIssuedBy: "",
  documentIssuedDate: "",
};

export const AgreementEntity = ({
  title,
  agreementEntities,
  onEntitiesChange,
}: AgreementEntityProps) => {
  const [entities, setEntities] =
    useState<AgreementEntityModel[]>(agreementEntities);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] =
    useState<AgreementEntityModel>(initialFormData);
  const [errors, setErrors] = useState<Partial<AgreementEntityModel>>({});

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setFormData(entities[index]);
    } else {
      setEditingIndex(null);
      setFormData(initialFormData);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIndex(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AgreementEntityModel> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!formData.documentType.trim()) {
      newErrors.documentType = "Loại giấy tờ là bắt buộc";
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = "Số giấy tờ là bắt buộc";
    }

    if (!formData.documentIssuedBy.trim()) {
      newErrors.documentIssuedBy = "Nơi cấp là bắt buộc";
    }

    if (!formData.documentIssuedDate) {
      newErrors.documentIssuedDate = "Ngày cấp là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingIndex !== null) {
      // Update existing entity
      const updatedEntities = [...entities];
      updatedEntities[editingIndex] = formData;
      setEntities(updatedEntities);
      onEntitiesChange?.(updatedEntities);
    } else {
      // Create new entity
      const newEntities = [...entities, formData];
      setEntities(newEntities);
      onEntitiesChange?.(newEntities);
    }

    handleCloseDialog();
  };

  const handleDelete = (index: number) => {
    const updatedEntities = entities.filter((_, i) => i !== index);
    setEntities(updatedEntities);
    onEntitiesChange?.(updatedEntities);
  };

  const handleInputChange = (
    field: keyof AgreementEntityModel,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm mới
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={2}>
        {entities.map((entity, index) => (
          <Box key={index} sx={{ width: { xs: '100%', md: 'calc(50% - 8px)', lg: 'calc(33.333% - 8px)' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {entity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Giới tính:</strong> {entity.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ngày sinh:</strong> {entity.dateOfBirth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Địa chỉ:</strong> {entity.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Loại giấy tờ:</strong> {entity.documentType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Số giấy tờ:</strong> {entity.documentNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nơi cấp:</strong> {entity.documentIssuedBy}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ngày cấp:</strong> {entity.documentIssuedDate}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(index)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingIndex !== null ? "Chỉnh sửa thông tin" : "Thêm mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Giới tính"
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <MenuItem value={GENDER.MALE}>{GENDER.MALE}</MenuItem>
                    <MenuItem value={GENDER.FEMALE}>{GENDER.FEMALE}</MenuItem>
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Tên"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <DatePicker
                  label="Ngày sinh"
                  value={
                    formData.dateOfBirth
                      ? dayjs(formData.dateOfBirth, "DD/MM/YYYY")
                      : null
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "dateOfBirth",
                      value ? value.format("DD/MM/YYYY") : ""
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                multiline
                rows={2}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Loại giấy tờ"
                  value={formData.documentType}
                  onChange={(e) =>
                    handleInputChange("documentType", e.target.value)
                  }
                  error={!!errors.documentType}
                  helperText={errors.documentType}
                />
              </Box>

              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Số giấy tờ"
                  value={formData.documentNumber}
                  onChange={(e) =>
                    handleInputChange("documentNumber", e.target.value)
                  }
                  error={!!errors.documentNumber}
                  helperText={errors.documentNumber}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Nơi cấp"
                  value={formData.documentIssuedBy}
                  onChange={(e) =>
                    handleInputChange("documentIssuedBy", e.target.value)
                  }
                  error={!!errors.documentIssuedBy}
                  helperText={errors.documentIssuedBy}
                />
              </Box>

              <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                <DatePicker
                  label="Ngày cấp"
                  value={
                    formData.documentIssuedDate
                      ? dayjs(formData.documentIssuedDate, "DD/MM/YYYY")
                      : null
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "documentIssuedDate",
                      value ? value.format("DD/MM/YYYY") : ""
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.documentIssuedDate,
                      helperText: errors.documentIssuedDate,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingIndex !== null ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
