import React from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useVersionCheck } from "@/hooks/useVersionCheck";

/**
 * Shows a persistent, VS Code-style prompt in the bottom-right corner when a
 * newer front-end version has been deployed, inviting the user to reload.
 *
 * Mount this once, near the app root.
 */
export const UpdateNotification: React.FC = () => {
  const updateAvailable = useVersionCheck();

  const reload = () => {
    // Force a fresh load, bypassing any cached bundle.
    window.location.reload();
  };

  return (
    <Snackbar
      open={updateAvailable}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        severity="info"
        variant="filled"
        icon={<RefreshIcon />}
        sx={{ alignItems: "center" }}
        action={
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            onClick={reload}
            sx={{ whiteSpace: "nowrap" }}
          >
            Tải lại
          </Button>
        }
      >
        Đã có phiên bản mới. Vui lòng tải lại để cập nhật.
      </Alert>
    </Snackbar>
  );
};
