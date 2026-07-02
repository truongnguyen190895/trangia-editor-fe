import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  /** Small uppercase label above the title, e.g. "Báo cáo" */
  eyebrow?: string;
  title: string;
  /** Right-aligned slot for the page's primary action */
  action?: ReactNode;
}

/** Standard page heading: optional eyebrow, serif title, action slot. */
export const PageHeader = ({ eyebrow, title, action }: PageHeaderProps) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Box flex={1} minWidth={0}>
        {eyebrow && (
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h4" sx={{ textWrap: "balance" }}>
          {title}
        </Typography>
      </Box>
      {action && <Box flexShrink={0}>{action}</Box>}
    </Box>
  );
};
