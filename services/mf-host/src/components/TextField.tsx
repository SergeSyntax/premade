import TextFieldMUI, { TextFieldProps } from "@mui/material/TextField";
import * as changeCase from "change-case";
import type { FieldApi, FieldMeta } from "@tanstack/react-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TanSTackField extends FieldApi<any, any, any, any> {}
interface Field extends Partial<Pick<TanSTackField, "state" | "handleBlur" | "handleChange">> {
  name: string;
  inputProps?: Omit<TextFieldProps, "variant">;
}

const FieldInfo = (meta: FieldMeta) => {
  if (meta?.touchedErrors.length) return <em>{meta?.touchedErrors}</em>;
  if (meta?.isValidating) return "Validating...";
  return <br />;
};

const TextField: React.FC<Field> = ({
  name,
  handleBlur,
  handleChange = () => {},
  state,
  inputProps = {},
}) => {
  return (
    <TextFieldMUI
      id={name}
      label={changeCase.capitalCase(name)}
      fullWidth
      margin="none"
      type="text"
      defaultValue={state?.value}
      onBlur={handleBlur}
      onChange={(e) => handleChange(e.target.value)}
      error={Boolean(state?.meta.touchedErrors.length)}
      helperText={FieldInfo(state!.meta)}
      {...inputProps}
    />
  );
};

export default TextField;
