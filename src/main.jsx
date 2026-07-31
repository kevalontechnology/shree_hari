import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as TailwindThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";
import theme from "./theme/theme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TailwindThemeProvider>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </TailwindThemeProvider>
  </StrictMode>
);