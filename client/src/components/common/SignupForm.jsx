import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signupForm = useFormik({
    initialValues: {
      displayName: "",  // ✅ Added displayName
      username: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      displayName: Yup.string()
        .min(3, "Display Name must be at least 3 characters") // ✅ Validation for displayName
        .required("Display Name is required"),
      username: Yup.string()
        .min(8, "Username must be at least 8 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm Password is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
    
      const requestData = {
        displayName: values.displayName, // ✅ Added displayName to request
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword
      };
    
      console.log("🟢 Signup Form Values:", values);
      console.log("📤 Signup Request Data:", requestData);
    
      const { response, err } = await userApi.signup(requestData);
      setIsLoginRequest(false);
    
      if (response) {
        signupForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Sign up successful!");
      }
    
      if (err) setErrorMessage(err.message);
    }
  });

  return (
    <Box component="form" onSubmit={signupForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="Display Name" // ✅ Added displayName field
          name="displayName"
          fullWidth
          value={signupForm.values.displayName}
          onChange={signupForm.handleChange}
          color="success"
          error={signupForm.touched.displayName && !!signupForm.errors.displayName}
          helperText={signupForm.touched.displayName && signupForm.errors.displayName}
        />

        <TextField
          type="text"
          placeholder="Username"
          name="username"
          fullWidth
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          color="success"
          error={signupForm.touched.username && !!signupForm.errors.username}
          helperText={signupForm.touched.username && signupForm.errors.username}
        />

        <TextField
          type="password"
          placeholder="Password"
          name="password"
          fullWidth
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          color="success"
          error={signupForm.touched.password && !!signupForm.errors.password}
          helperText={signupForm.touched.password && signupForm.errors.password}
        />

        <TextField
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          fullWidth
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
          color="success"
          error={signupForm.touched.confirmPassword && !!signupForm.errors.confirmPassword}
          helperText={signupForm.touched.confirmPassword && signupForm.errors.confirmPassword}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        Sign Up
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={switchAuthState}
      >
        Sign In
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SignupForm;
