import { Button, styled } from "@mui/material";
import { createLink } from "@tanstack/react-router";

export const MuiButton = styled(Button)({
  color: "inherit",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  borderRadius: "24px",
  marginLeft: "5px",
});

export const AuthButton = createLink(MuiButton);
