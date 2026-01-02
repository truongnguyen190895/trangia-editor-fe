import { Box, Typography, Paper, TextField } from "@mui/material";
import type { Property } from "@/api/inheritance";

interface InheritanceActions {
  updatePropertyField: (field: keyof Property, value: any) => void;
}

interface PropertySectionProps {
  property: Property;
  actions: InheritanceActions;
}

export const PropertySection = ({ property, actions }: PropertySectionProps) => {
  const handlePropertyChange = (field: keyof Property, value: any) => {
    actions.updatePropertyField(field, value);
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
        <Box display="flex" gap="25px" flexWrap="wrap">
          <Box width="200px">
            <Typography>ID</Typography>
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
            <Typography>Số giấy tờ</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={property.doc_id}
              onChange={(e) => handlePropertyChange("doc_id", e.target.value)}
            />
          </Box>
          <Box width="200px">
            <Typography>Số sổ</Typography>
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
              onChange={(e) => handlePropertyChange("issued_by", e.target.value)}
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
