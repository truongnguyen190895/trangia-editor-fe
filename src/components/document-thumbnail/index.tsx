import { Box, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface DocumentThumbnailProps {
  title: string;
  isUchiReady: boolean;
  onClick: () => void;
}

export const DocumentThumbnail = ({
  title,
  isUchiReady,
  onClick,
}: DocumentThumbnailProps) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        flex={1}
        sx={{
          cursor: "pointer",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          padding: 1,
          borderRadius: 1,
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 6px 16px -10px rgba(43, 38, 34, 0.35)",
          },
        }}
        onClick={onClick}
      >
        <AttachFileIcon fontSize="small" color="action" />
        <Typography variant="body2" fontWeight={500}>
          {title}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} sx={{ minWidth: "100px" }}>
        {isUchiReady ? <CheckBoxIcon color="success"/> : <RemoveCircleIcon color="error"/>}
      </Box>
    </Box>
  );
};
