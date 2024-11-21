import FmdBadIcon from "@mui/icons-material/FmdBad";
import { Box, Button, Typography } from "@mui/material";

import FileUploadIcon from "@mui/icons-material/FileUpload";

import TextFieldMUI, { TextFieldProps } from "@mui/material/TextField";
import * as changeCase from "change-case";
import type { FieldApi, FieldMeta } from "@tanstack/react-form";

import { InputHelperText } from "./InputHelperText";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TanSTackField extends FieldApi<any, any, any, any> {}
interface Field extends Partial<Pick<TanSTackField, "state" | "handleBlur" | "handleChange">> {
  name: string;
  inputProps?: Omit<TextFieldProps, "variant">;
}

export const UploadInput: React.FC<Field & { helperText: string }> = ({
  name,
  state,
  helperText,
}) => {
  return (
    <Box>
      <Box display="flex" alignItems="stretch" justifyContent="center" flex={1}>
        <TextFieldMUI
          id={name}
          size="small"
          value={(state?.value as File)?.name ?? ""}
          slotProps={{
            input: {
              sx: { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            }
          }}
          sx={{ flex: 1 }}
          error={Boolean(state?.meta.errors.length)}
        />
        <Button
          size="small"
          startIcon={<FileUploadIcon />}
          variant="contained"
          color={state?.meta.errors.length ? "error" : "primary"}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            boxShadow: "none",
          }}
        >
          Select {changeCase.capitalCase(name)}
        </Button>
      </Box>
      <InputHelperText meta={state?.meta as FieldMeta}>
        <Typography variant="caption">
          <Typography component="span" fontSize={12} display="inline-flex" marginRight=".2rem">
            <FmdBadIcon />
          </Typography>
          {helperText}
        </Typography>
      </InputHelperText>
    </Box>
  );
};
