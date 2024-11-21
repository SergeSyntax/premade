import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          verticalAlign: "middle",
          fontSize: "inherit",
          scale: '1.1'
        },
      },
    },
  },
  palette: {
    //   // mode: 'dark',
    //   primary: {
    //     main: '#556cd6',
    //   },
    secondary: {
      main: "#E10050",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
