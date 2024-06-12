import { Link, Typography, TypographyOwnProps } from "@mui/material";

export const Copyright: React.FC<TypographyOwnProps> = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
