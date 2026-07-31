// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     mode: "light",

//     primary: {
//       main: "#2563EB",
//     },

//     secondary: {
//       main: "#0F172A",
//     },

//     success: {
//       main: "#22C55E",
//     },

//     warning: {
//       main: "#F59E0B",
//     },

//     error: {
//       main: "#EF4444",
//     },

//     background: {
//       default: "#F6F8FC",
//       paper: "#FFFFFF",
//     },

//     text: {
//       primary: "#111827",
//       secondary: "#64748B",
//     },
//   },

//   typography: {
//     fontFamily: "Inter",

//     h3: {
//       fontWeight: 700,
//     },

//     h4: {
//       fontWeight: 700,
//     },

//     h5: {
//       fontWeight: 700,
//     },

//     h6: {
//       fontWeight: 600,
//     },

//     button: {
//       textTransform: "none",
//       fontWeight: 600,
//     },
//   },

//   shape: {
//     borderRadius: 16,
//   },

//   components: {
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 18,
//           boxShadow: "0 10px 35px rgba(15,23,42,.05)",
//           border: "1px solid #EEF2F7",
//           backgroundImage: "none",
//         },
//       },
//     },

//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           height: 44,
//           fontSize: 14,
//           boxShadow: "none",
//         },

//         contained: {
//           "&:hover": {
//             boxShadow: "0 8px 20px rgba(37,99,235,.25)",
//           },
//         },
//       },
//     },

//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           background: "#fff",
//           borderRadius: 12,

//           "& fieldset": {
//             borderColor: "#E2E8F0",
//           },

//           "&:hover fieldset": {
//             borderColor: "#2563EB",
//           },

//           "&.Mui-focused fieldset": {
//             borderWidth: "1px",
//             borderColor: "#2563EB",
//           },
//         },
//       },
//     },

//     MuiTableHead: {
//       styleOverrides: {
//         root: {
//           background: "#F8FAFC",
//         },
//       },
//     },

//     MuiTableCell: {
//       styleOverrides: {
//         head: {
//           fontWeight: 700,
//           color: "#475569",
//           borderBottom: "1px solid #E2E8F0",
//         },

//         body: {
//           borderBottom: "1px solid #F1F5F9",
//         },
//       },
//     },

//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           fontWeight: 600,
//         },
//       },
//     },

//     MuiTabs: {
//       styleOverrides: {
//         indicator: {
//           height: 3,
//           borderRadius: 20,
//         },
//       },
//     },
//   },
// });

// export default theme;

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563EB" },
    secondary: { main: "#0F172A" },
    success: { main: "#22C55E" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
    background: { default: "#F6F8FC", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#64748B" },
  },
  typography: { fontFamily: "Inter" },
});

export default theme;