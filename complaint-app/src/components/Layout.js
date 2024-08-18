import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext"; // Import the auth context

export default function Layout({ children }) {
  const { logout } = useAuth(); // Get the logout function from the context

  const handleLogout = () => {
    logout(); // Trigger the logout function
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#2E3B55" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Ruby Complaint Management
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}