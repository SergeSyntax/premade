import TextFieldMUI from "@mui/material/TextField";
import * as changeCase from "change-case";
import type { FieldApi, FieldMeta } from "@tanstack/react-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TanSTackField extends FieldApi<any, any, any, any> {}
interface Field
  extends Partial<
    Pick<TanSTackField, "state" | "handleBlur" | "handleChange">
  > {
  name: string;
  type?: React.InputHTMLAttributes<unknown>["type"];
}

const FieldInfo = (meta: FieldMeta) => {
  if (meta?.touchedErrors) return <em>{meta?.touchedErrors}</em>;
  if (meta?.isValidating) return "Validating...";
  return null;
};

const TextField: React.FC<Field> = ({
  name,
  handleBlur,
  handleChange = () => {},
  state,
  type,
}) => {
  return (
    <TextFieldMUI
      id={name}
      label={changeCase.capitalCase(name)}
      fullWidth
      type={type ?? "text"}
      defaultValue={state?.value}
      onBlur={handleBlur}
      onChange={(e) => handleChange(e.target.value)}
      error={Boolean(state?.meta.touchedErrors.length)}
      helperText={FieldInfo(state!.meta)}
    />
  );
};

export default TextField;
