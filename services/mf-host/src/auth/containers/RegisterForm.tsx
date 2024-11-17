import { useForm } from "@tanstack/react-form";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@/components/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { yupValidator } from '@tanstack/yup-form-adapter'
import { Copyright } from "../components/Copyright";
import { useRegister } from "../hooks/useRegister";
import { emailSchema, passwordSchema, textSchema } from "../schemas";
import { Link } from "@/components/link";
import { verifyEmail } from "../api/register";

export const RegisterForm = () => {
  const { mutate } = useRegister();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      allowExtraEmails: false,
    },
    onSubmit: async ({ value }) => mutate(value),
    validatorAdapter: yupValidator(),
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
      </Box>
      <Box
        component="form"
        sx={{ mt: 3 }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <form.Field
              name="firstName"
              children={TextField}
              validators={{
                onChange: textSchema,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <form.Field
              name="lastName"
              children={TextField}
              validators={{
                onChange: textSchema,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="email"
              children={TextField}
              asyncDebounceMs={300}
              validators={{
                onChange: emailSchema,
                onChangeAsync: async ({ value }) => {
                  if (value) {
                    const errorMessage = await verifyEmail(value);
                    console.log("errorMessage", errorMessage);

                    if (errorMessage) return errorMessage;
                  }
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="password"
              children={(field) => (
                <>
                  <TextField {...field} inputProps={{ type: "password" }} />
                </>
              )}
              validators={{
                onChange: passwordSchema,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <>
                  <TextField {...field} inputProps={{ type: "password" }} />
                </>
              )}
              validators={{
                onChangeListenTo: ["password"],
                onChange: passwordSchema,
                onChangeAsync: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue("password")) {
                    return "Passwords do not match";
                  }
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="allowExtraEmails"
              children={(field) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      id={field.name}
                      checked={field?.state?.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      value="allowExtraEmails"
                      color="primary"
                    />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              )}
            />
          </Grid>
        </Grid>
        <form.Subscribe
          selector={({ canSubmit, isSubmitting }) => ({
            canSubmit,
            isSubmitting,
          })}
          children={({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              fullWidth
              disabled={!canSubmit}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? "..." : "Sign Up"}
            </Button>
          )}
        />
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};
