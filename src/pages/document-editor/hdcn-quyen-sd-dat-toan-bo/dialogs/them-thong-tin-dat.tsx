import { Box, Dialog, DialogTitle } from "@mui/material";

interface ThemThongTinDatProps {
  open: boolean;
  handleClose: () => void;
}

export const ThemThongTinDat = ({ open, handleClose }: ThemThongTinDatProps) => {
  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm thông tin đất</DialogTitle>
      </Dialog>
    </Box>
  );
};