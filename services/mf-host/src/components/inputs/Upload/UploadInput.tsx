import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button, TextField, Typography } from "@mui/material";
import * as changeCase from "change-case";
import { InputHelperText } from "@/components/InputHelperText";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import { ControllerCommonProps } from "../../../types/input";
import { ControllerRenderProps } from "react-hook-form";

interface UploadInputProps extends ControllerCommonProps {
  helperText: string;
}

export const UploadInput: React.FC<UploadInputProps> = ({ field, fieldState, helperText }) => {
  const { name, value, ...rest } = field as ControllerRenderProps;
  return (
    <Box>
      <Box display="flex" alignItems="stretch" justifyContent="center" flex={1}>
        <TextField
          size="small"
          {...rest}
          value={(value as File)?.name ?? ""}
          slotProps={{
            input: {
              sx: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            },
          }}
          sx={{ flex: 1 }}
          error={Boolean(fieldState.error?.message)}
        />
        <Button
          size="small"
          startIcon={<FileUploadIcon />}
          variant="contained"
          color={fieldState.error?.message ? "error" : "primary"}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            boxShadow: "none",
          }}
        >
          Select {changeCase.capitalCase(name)}
        </Button>
      </Box>
      <InputHelperText state={fieldState}>
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
