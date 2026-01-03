import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { Property } from "@/api/inheritance";
import { ocrLandCertificate } from "@/api/inheritance";

interface InheritanceActions {
  updatePropertyField: (field: keyof Property, value: any) => void;
}

interface PropertySectionProps {
  property: Property;
  actions: InheritanceActions;
}

export const PropertySection = ({
  property,
  actions,
}: PropertySectionProps) => {
  const [isLoadingOcr, setIsLoadingOcr] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const handlePropertyChange = (field: keyof Property, value: any) => {
    actions.updatePropertyField(field, value);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setOcrError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    setIsLoadingOcr(true);
    setOcrError(null);

    try {
      const result = await ocrLandCertificate(file);
      // Populate the doc_id field with the extracted land certificate ID
      handlePropertyChange("doc_id", result.id);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể đọc thông tin từ ảnh. Vui lòng thử lại.";
      setOcrError(errorMessage);
    } finally {
      setIsLoadingOcr(false);
      // Reset the input so the same file can be selected again
      event.target.value = "";
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Thông tin tài sản
        </Typography>
        <Box width="100%" my="1rem" bgcolor="rgba(0, 0, 0, 0.06)" p="1rem" borderRadius="5px">
          <Typography sx={{ mb: 1 }}>
            Tải ảnh giấy chứng nhận quyền sử dụng đất
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="outlined"
              component="label"
              disabled={isLoadingOcr}
              startIcon={
                isLoadingOcr ? <CircularProgress size={20} /> : undefined
              }
            >
              {isLoadingOcr ? "Đang xử lý..." : "Chọn ảnh"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
                disabled={isLoadingOcr}
              />
            </Button>
            {ocrError && (
              <Alert severity="error" sx={{ flex: 1 }}>
                {ocrError}
              </Alert>
            )}
          </Box>
        </Box>
        <Box display="flex" gap="25px" flexWrap="wrap">
          <Box width="200px">
            <Typography>Thửa đất</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.id}
              onChange={(e) => handlePropertyChange("id", e.target.value)}
            />
          </Box>
          <Box width="200px">
            <Typography>Loại giấy tờ</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.doc_type}
              onChange={(e) => handlePropertyChange("doc_type", e.target.value)}
            />
          </Box>
          <Box width="200px">
            <Typography>Số giấy tờ (số trên sổ đỏ)</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.doc_id}
              onChange={(e) => handlePropertyChange("doc_id", e.target.value)}
            />
          </Box>
          <Box width="200px">
            <Typography>Số vào sổ cấp GCN</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.notebook_id}
              onChange={(e) =>
                handlePropertyChange("notebook_id", e.target.value)
              }
            />
          </Box>
          <Box width="100%">
            <Typography>Địa chỉ</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.address}
              onChange={(e) => handlePropertyChange("address", e.target.value)}
            />
          </Box>
          <Box width="100%">
            <Typography>Địa chỉ cũ</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.address_old || ""}
              onChange={(e) =>
                handlePropertyChange("address_old", e.target.value)
              }
            />
          </Box>
          <Box width="300px">
            <Typography>Nơi cấp</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.issued_by}
              onChange={(e) =>
                handlePropertyChange("issued_by", e.target.value)
              }
            />
          </Box>
          <Box width="200px">
            <Typography>Ngày cấp</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.issued_date}
              onChange={(e) =>
                handlePropertyChange("issued_date", e.target.value)
              }
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
