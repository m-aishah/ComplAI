import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Inter } from "next/font/google";
import theme from "../lib/theme";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Ruby Complaint Management System</title>
        <meta name="description" content="The Ruby Complaint Management System is a comprehensive tool designed to streamline the process of managing and analyzing customer complaints. " />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}