"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Box, Button, TextField, Typography, Paper, Link, Alert } from "@mui/material";
import { styled } from "@mui/system";

const Wrapper = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F7FA',
});

const FormPaper = styled(Paper)({
  padding: '2rem',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  borderRadius: '10px',
});

const Logo = styled(Box)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
});

const FooterLink = styled(Link)({
  marginTop: '1rem',
  color: '#0A2540',
  textDecoration: 'none',
  fontSize: '0.875rem',
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    switch (error.code) {
      case "auth/user-not-found":
        setError("No account found with this email.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password. Please try again.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format. Please enter a valid email address.");
        break;
      default:
        setError("Failed to sign in. Please try again later.");
    }
  };

  return (
    <Wrapper>
      <FormPaper elevation={3}>
        <Logo>Ruby</Logo>
        <Typography variant="h6" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please enter your login details below
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error.includes("Email")}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.includes("Password")}
          />
          <Link href="#" underline="none" sx={{ display: "block", textAlign: "right", mt: 1 }}>
            Forgot Password?
          </Link>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
          <FooterLink href="/auth/signup">
            Don’t have an account? Create one
          </FooterLink>
        </form>
      </FormPaper>
    </Wrapper>
  );
}