import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";

interface StickyActionBarProps {
  /** Short status line shown at the left. Ignored when `missingParts` is set. */
  status?: ReactNode;
  /**
   * The still-missing required fields. When provided, the bar renders the
   * standard completeness line itself — "Đủ thông tin — sẵn sàng tạo văn bản"
   * when empty, otherwise "Còn thiếu: …" — so editors don't each repeat it.
   * Accepts the falsy entries produced by the editors' `[cond && "…"]` arrays;
   * they're filtered out here.
   */
  missingParts?: Array<string | false | null | undefined>;
  children: ReactNode;
}

/**
 * Bottom bar that stays visible while scrolling long editor forms, so the
 * primary actions ("Tạo hợp đồng", "Khai thuế", …) never require scrolling
 * to the end of the page. Relies on the Layout content column being the
 * scroll container.
 */
export const StickyActionBar = ({
  status,
  missingParts,
  children,
}: StickyActionBarProps) => {
  const missing = missingParts?.filter((p): p is string => Boolean(p));
  const statusNode = missing
    ? missing.length === 0
      ? "Đủ thông tin — sẵn sàng tạo văn bản"
      : `Còn thiếu: ${missing.join(", ")}`
    : status;
  return (
    <Paper
      elevation={0}
      sx={{
        // On md the Layout content padding is 2rem all round, so a -32px offset
        // cancels it and the bar sits flush at the viewport bottom. On xs the
        // content reserves MOBILE_NAV_HEIGHT of bottom padding for the fixed
        // bottom nav; a 0 offset parks the bar on top of that padding — i.e.
        // directly above the nav — instead of scrolling underneath it.
        position: "sticky",
        bottom: { xs: 0, md: -32 },
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
        zIndex: 1100,
      }}
    >
      {statusNode && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mr: "auto", minWidth: 0 }}
        >
          {statusNode}
        </Typography>
      )}
      <Box
        display="flex"
        gap={1}
        flexWrap="wrap"
        sx={{ ml: statusNode ? 0 : "auto" }}
      >
        {children}
      </Box>
    </Paper>
  );
};
