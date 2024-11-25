import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { Copyright } from "../components/Copyright";
import { useRegister } from "../hooks/useRegister";
import { Link } from "@/components/link";
import { verifyEmail } from "../api/register";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/inputs/TextField";
import debounce from "lodash.debounce";
import { useEffect } from "react";

const registerSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").toLowerCase(),
    password: z.string().min(5, "Password must be at least 5 characters").max(255),
    confirmPassword: z.string().min(5, "Password must be at least 5 characters").max(255),
    allowExtraEmails: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { mutate } = useRegister();

  const { formState, control, handleSubmit, setError, clearErrors, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      allowExtraEmails: false,
    },
    mode: "all",
  });

  const handleFormSubmit: SubmitHandler<RegisterSchema> = async (values) => mutate(values);

  const { isSubmitting, isValid } = formState;

  // Debounced email validation
  const validateEmail = debounce(async (email: string) => {
    if (!email) return;

    const errorMessage = await verifyEmail(email);
    if (errorMessage) {
      setError("email", { type: "manual", message: errorMessage });
    } else {
      clearErrors("email");
    }
  }, 300);

  const email = watch("email");

  useEffect(() => {
    if (isValid) validateEmail(email);
    return validateEmail.cancel;
  }, [email, isValid]);
  // const form = useForm({
  //   defaultValues: {

  //   },
  //   onSubmit: async ({ value }) => mutate(value),
  //   validatorAdapter: yupValidator(),
  // });

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
      <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="firstName"
              render={(props) => <TextField fullWidth {...props} autoFocus />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="lastName"
              render={(props) => <TextField fullWidth {...props} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="email"
              render={(props) => <TextField fullWidth {...props} />}
              rules={{
                validate: async (_value) => "test",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="password"
              render={(props) => (
                <TextField fullWidth {...props} slotProps={{ input: { type: "password" } }} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="confirmPassword"
              render={(field) => (
                <TextField fullWidth {...field} slotProps={{ input: { type: "password" } }} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="allowExtraEmails"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      id={field.name}
                      checked={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.target.checked)}
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

        <Button
          type="submit"
          fullWidth
          disabled={!isValid}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isSubmitting ? "..." : "Sign Up"}
        </Button>

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
