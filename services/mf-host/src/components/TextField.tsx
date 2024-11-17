import TextFieldMUI, { TextFieldProps } from "@mui/material/TextField";
import * as changeCase from "change-case";
import type { FieldApi, FieldMeta } from "@tanstack/react-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TanSTackField extends FieldApi<any, any, any, any> {}
interface Field extends Partial<Pick<TanSTackField, "state" | "handleBlur" | "handleChange">> {
  name: string;
  inputProps?: Omit<TextFieldProps, "variant">;
  maxRows?: number;
  multiline?: boolean;
  omitLabel?: boolean;
  handleClick?: React.MouseEventHandler<HTMLDivElement>;
  minRows?: number;
}

const FieldInfo = (meta: FieldMeta) => {
  if (meta?.errors.length) return <em>{meta?.errors.at(0)}</em>;
  if (meta?.isValidating) return "Validating...";
  return <br />;
};

const TextField: React.FC<Field> = ({
  name,
  handleBlur,
  handleChange = () => {},
  handleClick = () => {},
  state,
  omitLabel,
  multiline = false,
  inputProps = {},
  minRows = 1,
}) => {
  return (
    <TextFieldMUI
      id={name}
      label={omitLabel ? null : changeCase.capitalCase(name)}
      fullWidth
      multiline={multiline}
      margin="none"
      type="text"
      minRows={minRows}
      value={state?.value}
      onBlur={handleBlur}
      onClick={handleClick}
      onChange={(e) => handleChange(e.target.value)}
      error={Boolean(state?.meta.errors.length)}
      helperText={FieldInfo(state!.meta)}
      {...inputProps}
    />
  );
};

export default TextField;
