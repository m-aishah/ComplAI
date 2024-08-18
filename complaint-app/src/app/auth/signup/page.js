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

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      router.push("/dashboard");
    } catch (error) {
      handleSignupError(error);
    }
  };

  const handleSignupError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        setError("Email is already in use. Please use a different email.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format. Please enter a valid email address.");
        break;
      case "auth/weak-password":
        setError("Password is too weak. Please use a stronger password.");
        break;
      default:
        setError("Failed to sign up. Please try again later.");
    }
  };

  return (
    <Wrapper>
      <FormPaper elevation={3}>
        <Logo>Ruby</Logo>
        <Typography variant="h6" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please enter your details below to create an account
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Signup
          </Button>
          <FooterLink href="/auth/login">
            Already have an account? Sign in
          </FooterLink>
        </form>
      </FormPaper>
    </Wrapper>
  );
}