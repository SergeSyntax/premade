import { Box, FormControlLabel, FormHelperText, Radio } from "@mui/material";

interface RadioDescribedInputProps {
  label: string;
  value: number;
  description: string;
}
export const RadioDescribedInput: React.FC<RadioDescribedInputProps> = ({
  label,
  value,
  description,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <FormControlLabel
        value={value}
        control={<Radio value={value} id={`radio-input-${label}`} sx={{ padding: "0 .5rem" }} />}
        label={label}
      />
      <FormHelperText
        component="label"
        htmlFor={`radio-input-${label}`}
        sx={{ margin: "0 1.4rem .5rem", cursor: "pointer" }}
      >
        {description}
      </FormHelperText>
    </Box>
  );
};
