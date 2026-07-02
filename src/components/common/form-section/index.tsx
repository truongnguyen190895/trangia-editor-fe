import type { ReactNode } from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { SERIF_FAMILY } from "@/theme";

interface FormSectionProps {
  /** Anchor id for the section navigator */
  id?: string;
  /** Roman numeral or ordinal shown before the title, e.g. "I" */
  numeral?: string;
  title: string;
  /** undefined = no status chip; true = complete; false = missing info */
  complete?: boolean;
  /** Custom label for the incomplete state */
  incompleteLabel?: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Card section for document-editor forms, styled after the numbered
 * (I/II/III) sections of the notarial contracts the form produces.
 */
export const FormSection = ({
  id,
  numeral,
  title,
  complete,
  incompleteLabel = "Chưa đủ thông tin",
  action,
  children,
}: FormSectionProps) => {
  return (
    <Paper
      id={id}
      variant="outlined"
      sx={{ overflow: "hidden", scrollMarginTop: "16px" }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        {numeral && (
          <Typography
            sx={{
              fontFamily: SERIF_FAMILY,
              fontWeight: 700,
              color: "primary.main",
              minWidth: "1.4rem",
            }}
          >
            {numeral}.
          </Typography>
        )}
        <Typography
          sx={{ fontFamily: SERIF_FAMILY, fontWeight: 700, fontSize: "1.05rem" }}
        >
          {title}
        </Typography>
        {complete !== undefined && (
          <Chip
            size="small"
            variant="outlined"
            icon={
              complete ? (
                <CheckCircleOutlineIcon />
              ) : (
                <ErrorOutlineIcon />
              )
            }
            label={complete ? "Đủ thông tin" : incompleteLabel}
            color={complete ? "success" : "warning"}
            sx={{ ml: 1 }}
          />
        )}
        {action && <Box ml="auto">{action}</Box>}
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
  );
};
