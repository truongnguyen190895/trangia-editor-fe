import { createTheme } from "@mui/material/styles";

// Design tokens for the «Văn phòng số + Ấn triện» direction — see UI-REDESIGN.md.
// All colors in the app must come from this palette; never hardcode hex in pages.

const SEAL_RED = "#8C2F2B";
const SEAL_RED_DARK = "#6E2320";
const SEAL_RED_LIGHT = "#A94B45";
const INK_NAVY = "#16232F";
const INK = "#2B2622";
const INK_SOFT = "#6B655C";
const PAPER_GREY = "#F6F5F2";
const LINE = "#E4E1DA";

export const SERIF_FAMILY = '"Lora", Georgia, "Times New Roman", serif';
const SANS_FAMILY =
  '"Be Vietnam Pro", "Segoe UI", system-ui, -apple-system, Arial, sans-serif';

export const theme = createTheme({
  palette: {
    primary: {
      main: SEAL_RED,
      dark: SEAL_RED_DARK,
      light: SEAL_RED_LIGHT,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: INK_NAVY,
      contrastText: "#FFFFFF",
    },
    success: { main: "#3F6B4F" },
    warning: { main: "#C07A24" },
    error: { main: "#B3352E" },
    background: {
      default: PAPER_GREY,
      paper: "#FFFFFF",
    },
    text: {
      primary: INK,
      secondary: INK_SOFT,
    },
    divider: LINE,
  },
  typography: {
    fontFamily: SANS_FAMILY,
    h1: { fontFamily: SERIF_FAMILY, fontWeight: 700 },
    h2: { fontFamily: SERIF_FAMILY, fontWeight: 700 },
    h3: { fontFamily: SERIF_FAMILY, fontWeight: 700, fontSize: "1.75rem" },
    h4: { fontFamily: SERIF_FAMILY, fontWeight: 600, fontSize: "1.4rem" },
    h5: { fontWeight: 600, fontSize: "1.15rem" },
    h6: { fontWeight: 600, fontSize: "1.05rem" },
    subtitle1: { fontWeight: 500 },
    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.85rem" },
    // Small uppercase "eyebrow" label used above page/section titles and as
    // table column headers. Rendered block-level so it sits on its own line.
    overline: {
      display: "block",
      fontSize: "0.7rem",
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: INK_SOFT,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
    },
    caption: { color: INK_SOFT },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: "1rem",
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: LINE,
        },
      },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderColor: LINE,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: SERIF_FAMILY,
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: INK_SOFT,
            backgroundColor: PAPER_GREY,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: LINE,
          fontVariantNumeric: "tabular-nums",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: INK_NAVY },
      },
    },
  },
});
