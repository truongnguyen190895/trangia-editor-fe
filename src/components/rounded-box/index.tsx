import { Box, Chip, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
        border: "1px solid",
        borderColor: "divider",
        borderStyle: active ? "solid" : "dashed",
        backgroundColor: active ? "background.paper" : "transparent",
        p: 2,
        cursor: active ? "pointer" : "default",
        opacity: active ? 1 : 0.6,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        ...(active && {
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 6px 16px -10px rgba(43, 38, 34, 0.35)",
          },
        }),
      }}
      onClick={active ? onClick : undefined}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: active ? "rgba(140, 47, 43, 0.08)" : "action.hover",
          color: active ? "primary.main" : "text.secondary",
          flexShrink: 0,
        }}
      >
        <FolderIcon />
      </Box>
      <Box flex={1} minWidth={0}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{label}</Typography>
          {!active && (
            <Chip label="Sắp có" size="small" variant="outlined" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {active && <ChevronRightIcon sx={{ color: "text.secondary" }} />}
    </Box>
  );
};
