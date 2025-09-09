import React from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Box,
} from "@mui/material";

interface LoadingDialogProps {
  open: boolean;
  message?: string;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({ open }) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={3}
        >
          <CircularProgress size={50} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
