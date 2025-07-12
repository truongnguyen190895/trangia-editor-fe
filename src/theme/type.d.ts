import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
      softTeal: string;
    }
    interface PaletteOptions {
      softTeal?: string;
    }
  }