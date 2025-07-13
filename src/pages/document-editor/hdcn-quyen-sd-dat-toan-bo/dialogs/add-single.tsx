import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface AddSingleDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddSingleDialog = ({ open, onClose }: AddSingleDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm thông tin cá nhân</DialogTitle>
    </Dialog>
  );
};