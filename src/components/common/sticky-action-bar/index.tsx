import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";

interface StickyActionBarProps {
  /** Short status line shown at the left, e.g. what is still missing */
  status?: ReactNode;
  children: ReactNode;
}

/**
 * Bottom bar that stays visible while scrolling long editor forms, so the
 * primary actions ("Tạo hợp đồng", "Khai thuế", …) never require scrolling
 * to the end of the page. Relies on the Layout content column being the
 * scroll container.
 */
export const StickyActionBar = ({ status, children }: StickyActionBarProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "sticky",
        bottom: { xs: -16, md: -32 }, // cancel the Layout content padding
        mx: { xs: -2, md: 0 },
        mt: 1,
        px: 2,
        py: 1.25,
        borderTop: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        zIndex: 10,
      }}
    >
      {status && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mr: "auto", minWidth: 0 }}
        >
          {status}
        </Typography>
      )}
      <Box
        display="flex"
        gap={1}
        flexWrap="wrap"
        sx={{ ml: status ? 0 : "auto" }}
      >
        {children}
      </Box>
    </Paper>
  );
};
