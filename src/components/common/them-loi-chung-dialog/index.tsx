import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Checkbox,
} from "@mui/material";

interface ThemLoiChungDialogProps {
  open: boolean;
  onClose: () => void;
  handleGenerateDocument: () => void;
}

export const ThemLoiChungDialog = ({
  open,
  onClose,
  handleGenerateDocument,
}: ThemLoiChungDialogProps) => {
  const [sốBảnGốc, setSốBảnGốc] = useState(4);
  const [isOutSide, setIsOutSide] = useState(false);

  const handleClick = () => {
    handleGenerateDocument()
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Thông tin hợp đồng</DialogTitle>
      <DialogContent>
        <Box>
          <Box display="flex" gap="0.5rem" alignItems="center">
            <InputLabel
              htmlFor="sốBảnGốc"
              sx={{ fontSize: "1.2rem", fontWeight: "600" }}
            >
              Số bản gốc
            </InputLabel>
            <TextField
              type="number"
              name="sốBảnGốc"
              slotProps={{
                htmlInput: {
                  min: 2,
                },
              }}
              value={sốBảnGốc}
              onChange={(e) => setSốBảnGốc(Number(e.target.value))}
            />
          </Box>

          <Box display="flex" alignItems="center" gap="0.5rem">
            <InputLabel
              htmlFor="isOutSide"
              sx={{ fontSize: "1.2rem", fontWeight: "600" }}
            >
              Hợp đồng được ký bên ngoài văn phòng?
            </InputLabel>
            <Checkbox
              id="isOutSide"
              size="large"
              color="info"
              checked={isOutSide}
              onChange={() => setIsOutSide(!isOutSide)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={sốBảnGốc <= 0}
          onClick={handleClick}
        >
          Tạo hợp đồng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
