"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Box, Button, TextField, Typography, Paper, Link } from "@mui/material";
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
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to login", error);
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
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href="#" underline="none" color="secondary.main">
            Forgot Password?
          </Link>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Sign in
          </Button>
          <FooterLink href="/auth/signup">
            Create an account
          </FooterLink>
        </form>
      </FormPaper>
    </Wrapper>
  );
}
