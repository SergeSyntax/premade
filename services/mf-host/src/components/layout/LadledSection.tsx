import { Box, Card, FormControl, FormLabel, Typography } from "@mui/material";

export const LadledSection: React.FC<{
  icon?: React.ReactElement;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  htmlFor?: string;
}> = ({ actions, children, icon, title, htmlFor }) => {
  return (
    <Box marginTop={2}>
      <Box paddingBottom=".4rem" border="none" display="flex" justifyContent="space-between">
        <FormLabel
          sx={{ display: "flex", alignItems: "center", paddingLeft: `${icon ? 0 : 1.54}rem` }}
          htmlFor={htmlFor}
        >
          {icon && (
            <Typography component="span" fontSize={16} marginRight={1.5}>
              {icon}
            </Typography>
          )}
          <Typography component="span" variant="subtitle1" textTransform="capitalize">
            {title}
          </Typography>
        </FormLabel>
        <Box>{actions}</Box>
      </Box>
      <Card>
        <FormControl
          sx={{
            display: "flex",
            padding: 2,
          }}
        >
          {children}
        </FormControl>
      </Card>
    </Box>
  );
};
