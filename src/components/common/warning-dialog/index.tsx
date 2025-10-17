import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface WarningDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
}

export const WarningDialog: React.FC<WarningDialogProps> = ({
  open,
  title = "Cảnh báo",
  message,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="warning-dialog-title"
      aria-describedby="warning-dialog-description"
    >
      <DialogTitle id="warning-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="warning-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="error" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
