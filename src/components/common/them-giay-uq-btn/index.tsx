import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
} from "@mui/material";

export const ThemGiayUQButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen}>
        Tạo giấy UQ
      </Button>
      <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
        <DialogTitle>GUQ</DialogTitle>
        <DialogContent>
          <Box>
            <Typography>Ben Uy quyen</Typography>
          </Box>
          <Box>
            <Typography>Ben nhan uy quyen</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
