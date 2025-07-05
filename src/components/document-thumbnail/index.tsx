import { Box, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface DocumentThumbnailProps {
  title: string;
  onClick: () => void;
}

export const DocumentThumbnail = ({ title, onClick }: DocumentThumbnailProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        cursor: "pointer",
        border: "1px solid #000",
        padding: 1,
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "#f5f5f5",
          transform: "scale(1.01)",
          transition: "all 0.2s ease-in-out"
        },
      }}
      onClick={onClick}
    >
      <AttachFileIcon />
      <Typography variant="h6" sx={{ fontSize: "14px" }}>
        {title}
      </Typography>
    </Box>
  );
};
