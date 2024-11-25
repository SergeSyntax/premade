import { FormHelperText, LinearProgress } from "@mui/material";
import { ControllerFieldState } from "react-hook-form";

interface InputHelperTextProps {
  state: ControllerFieldState;
  children: React.ReactNode; // ReactNode is more appropriate for the children prop
}

export const InputHelperText: React.FC<InputHelperTextProps> = ({ state, children }) => {
  if (state.isValidating) return <LinearProgress color="success" />;

  // Destructure props here
  return (
    <FormHelperText error={Boolean(state.error?.message)}>
      {state.error?.message ? state.error?.message : children || <br />}
    </FormHelperText>
  );
};
