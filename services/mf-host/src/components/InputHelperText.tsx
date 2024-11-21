import { FormHelperText, LinearProgress } from "@mui/material";
import { FieldMeta } from "@tanstack/react-form";

interface InputHelperTextProps {
  meta: FieldMeta;
  children: React.ReactNode; // ReactNode is more appropriate for the children prop
}

export const InputHelperText: React.FC<InputHelperTextProps> = ({ meta, children }) => {
  if (meta?.isValidating) return <LinearProgress color="success" />;

  // Destructure props here
  return (
    <FormHelperText error={Boolean(meta?.errors.length)}>
      {meta?.errors.length ? meta.errors.at(0) : children || <br />}
    </FormHelperText>
  );
};
