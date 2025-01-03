import { TextFieldProps } from "@mui/material";
import { TextField as TextFieldMUI } from "@mui/material";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import * as changeCase from "change-case";
import { ControllerCommonProps } from "../../types/input";

type CustomTextFieldProps = TextFieldProps &
  ControllerCommonProps & {
    omitLabel?: boolean;
  };

const FieldInfo = (fieldState: ControllerFieldState) => {
  fieldState.error;
  if (fieldState.error) return <em>{fieldState.error.message}</em>;
  return <br />;
};

export const TextField: React.FC<CustomTextFieldProps> = ({
  field,
  fieldState,
  minRows = 1,
  maxRows,
  omitLabel = false,
  formState: _formState,
  onChange,
  ...otherProps
}) => {
  const { name, ...rest } = field as ControllerRenderProps;

  return (
    <TextFieldMUI
      {...otherProps}
      {...rest}
      id={name}
      label={omitLabel ? null : changeCase.capitalCase(name)}
      fullWidth
      minRows={minRows}
      multiline={+minRows > 1}
      maxRows={maxRows}
      type="text"
      variant="outlined"
      error={Boolean(fieldState.error?.message)}
      helperText={FieldInfo(fieldState)}
      onChange={onChange ?? rest.onChange}
    />
  );
};
