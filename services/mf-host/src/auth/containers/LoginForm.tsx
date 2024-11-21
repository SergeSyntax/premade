import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Copyright } from "../components/Copyright";
import { useForm } from "@tanstack/react-form";
import { useLogin } from "../hooks";
import { yupValidator } from '@tanstack/yup-form-adapter'
import { emailSchema, passwordSchema } from "../schemas";
import TextField from "@/components/TextField";
import { Link } from "@/components/link";

export const LoginForm = () => {
  const { mutate } = useLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => mutate(value),
    validatorAdapter: yupValidator(),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <form.Field
            name="email"
            children={(props) => (
              <TextField
                {...props}
                inputProps={{
                  autoFocus: true,
                }}
              />
            )}
            validators={{
              onChange: emailSchema,
            }}
          />

          <form.Field
            name="password"
            children={(field) => (
              <>
                <TextField
                  {...field}
                  inputProps={{
                    type: "password",
                  }}
                />
              </>
            )}
            validators={{
              onChange: passwordSchema,
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
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
              {isSubmitting ? "..." : "Sign In"}
            </Button>
          )}
        />
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};
