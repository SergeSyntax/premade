import AdbIcon from "@mui/icons-material/Adb";
import { Box, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
export const Logo = () => {
  return (
    <Box
      component={Link}
      to="/#"
      sx={{
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        LOGO
      </Typography>
    </Box>
  );
};
