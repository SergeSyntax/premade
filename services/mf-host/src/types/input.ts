import { ControllerFieldState, Noop, RefCallBack, UseFormStateReturn } from "react-hook-form";

export type ControllerRenderProps = {
  onChange: (...event: unknown[]) => void;
  onBlur: Noop;
  value: unknown;
  disabled?: boolean;
  name: string;
  ref: RefCallBack;
};

export type ControllerCommonProps = {
  field: ControllerRenderProps | unknown;
  formState: UseFormStateReturn<any>;
  fieldState: ControllerFieldState;
};
