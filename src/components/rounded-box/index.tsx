import { Box, Typography } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';

interface RoundedBoxProps {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

export const RoundedBox = ({
  label,
  description,
  active,
  onClick,
}: RoundedBoxProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        backgroundColor: active ? "transparent" : "#f5f5f5",
        p: 2,
        cursor: active ? "pointer" : "not-allowed",
        "&:hover": {
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
      onClick={active ? onClick : undefined}
    >
      <Box>
        <FolderIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
      </Box>
      <Box>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>
    </Box>
  );
};
