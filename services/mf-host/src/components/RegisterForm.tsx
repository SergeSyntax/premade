import { useForm } from "@tanstack/react-form";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@/components/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import * as Yup from "yup";
import { yupValidator } from "@tanstack/yup-form-adapter";
import { DefaultComponentProps, OverridableTypeMap } from "@mui/material/OverridableComponent";
import { verifyEmail } from "@/api/verifyEmail";

function Copyright(props: DefaultComponentProps<OverridableTypeMap>) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const RegisterForm = () => {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      allowExtraEmails: false,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
    validatorAdapter: yupValidator,
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
                onChange: Yup.string()
                  .min(3, "First name must be at least 3 characters")
                  .max(255)
                  .required(),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <form.Field
              name="lastName"
              children={TextField}
              validators={{
                onChange: Yup.string()
                  .min(3, "Last name must be at least 3 characters")
                  .max(255)
                  .required(),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="email"
              children={TextField}
              asyncDebounceMs={300}
              validators={{
                onChange: Yup.string().min(3).max(255).email().required(),
                onChangeAsync: Yup.string().test(
                  "isEmailUnique",
                  "This email is already in use.",
                  async (value?: string) => {
                    try {
                      if (value) {
                        const { data } = await verifyEmail(value);
                        return data?.isValid;
                      }
                      return false;
                    } catch (error) {
                      console.log(error);
                      
                      return false;
                    }
                  },
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="password"
              children={(field) => (
                <>
                  <TextField {...field} type="password" />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <>
                  <TextField {...field} type="password" />
                </>
              )}
              validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) => {
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
            <Link href="#" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default RegisterForm;
