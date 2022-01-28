import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { deepPurple, amber } from "@mui/material/colors";

// Create a theme instance.
export const theme = createTheme({
  palette: {
    primary: {
      main: "#6867AC",
    },
    secondary: {
      main: "#A267AC",
      light: "#CE7BB0",
      dark: "#FFBCD1",
    },
    text: {
      primary: "rgba(0, 0, 0, 1)",
      secondary: "rgba(0, 0, 0, 1)",
    },
  },
  typography: {
    htmlFontSize: 14,
    allVariants: { letterSpacing: 0.1 },
    h1: { fontSize: 32, fontWeight: "bold", display: "content" },
    h2: { fontSize: 24, fontWeight: 700 },
    h3: { fontSize: 20, fontWeight: 700 },
    h4: { fontSize: 16, fontWeight: "bold" },
    subtitle2: { fontSize: 18, fontWeight: 400 },
    body1: { fontSize: 16, fontWeight: "normal" },
    body2: { fontSize: 14, fontWeight: "normal" },
  },
});
