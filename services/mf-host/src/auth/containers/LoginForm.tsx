import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Copyright } from "../components/Copyright";
import { useLogin } from "../hooks";
import { Link } from "@/components/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/inputs/TextField";

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(5).max(255),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { mutate } = useLogin();

  const { control, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const { isSubmitting, isValid } = formState;

  const handleFormSubmit: SubmitHandler<LoginSchema> = async (values) => mutate(values);

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
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            control={control}
            name="email"
            render={(props) => <TextField {...props} autoFocus />}
          />
          <Controller
            control={control}
            name="password"
            render={(props) => <TextField {...props} slotProps={{ input: { type: "password" } }} />}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            disabled={!isValid}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? "..." : "Sign In"}
          </Button>
          <Grid container spacing={2}>
            <Grid size="auto">
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid size="auto">
              <Link href="/register" variant="body2">
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
