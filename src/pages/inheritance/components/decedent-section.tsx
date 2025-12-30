import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import type { DeathCertificate, Person } from "../interface";
import { FirstClassHeirs } from "./first-class-heirs";

interface DecedentSectionProps {
  decedent: Person;
  onDecedentChange: (decedent: Person) => void;
}

export const DecedentSection = ({
  decedent,
  onDecedentChange,
}: DecedentSectionProps) => {
  const handleDecedentChange = (field: keyof Person, value: any) => {
    onDecedentChange({ ...decedent, [field]: value });
  };

  const handleDeathCertificateChange = (
    field: keyof DeathCertificate,
    value: any
  ) => {
    const currentCertificate = decedent.death_certificate || {
      id: "",
      died_date: "",
      issued_date: "",
      issued_by: "",
    };
    onDecedentChange({
      ...decedent,
      death_certificate: { ...currentCertificate, [field]: value },
    });
  };
  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Người để lại di sản
        </Typography>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thông tin cá nhân
          </Typography>
          <Box display="flex" gap="25px">
            <Box width="150px">
              <Typography>Giới tính *</Typography>
              <Select
                variant="outlined"
                fullWidth
                value={decedent.sex}
                onChange={(e) => handleDecedentChange("sex", e.target.value)}
              >
                <MenuItem value="Male">Ông</MenuItem>
                <MenuItem value="Female">Bà</MenuItem>
              </Select>
            </Box>
            <Box width="350px">
              <Typography>Tên *</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={decedent.name}
                onChange={(e) => handleDecedentChange("name", e.target.value)}
              />
            </Box>
            <Box width="150px">
              <Typography>Năm sinh *</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={decedent.birth_year}
                onChange={(e) =>
                  handleDecedentChange("birth_year", e.target.value)
                }
              />
            </Box>
          </Box>
        </Box>
        <Box mt="20px">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thông tin giấy chứng tử
          </Typography>
          <Box display="flex" gap="25px" flexWrap="wrap">
            <Box width="200px">
              <Typography>Chết ngày *</Typography>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  handleDeathCertificateChange("died_date", e.target.value)
                }
              />
            </Box>
            <Box width="200px">
              <Typography>Số trích lục khai tử</Typography>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  handleDeathCertificateChange("id", e.target.value)
                }
              />
            </Box>
            <Box width="450px">
              <Typography>Nơi cấp</Typography>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  handleDeathCertificateChange("issued_by", e.target.value)
                }
              />
            </Box>
            <Box width="200px">
              <Typography>Ngày cấp</Typography>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  handleDeathCertificateChange("issued_date", e.target.value)
                }
              />
            </Box>
          </Box>
        </Box>
        <Box mt="40px">
          <FirstClassHeirs decedentGender={decedent.sex} />
        </Box>
      </Paper>
    </Box>
  );
};
