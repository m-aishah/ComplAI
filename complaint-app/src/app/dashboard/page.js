"use client";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation"; // Updated to next/navigation
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase"; // Import Firebase Firestore
import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import Layout from "@/components/Layout";
import ComplaintDetails from "@/components/ComplaintDetails";
import ComplaintForm from "@/components/ComplaintForm";
import ComplaintList from "@/components/ComplaintList";
import ComplaintPreview from "@/components/ComplaintPreview";
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [inputType, setInputType] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, "complaints"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const complaintsData = [];
        querySnapshot.forEach((doc) => {
          complaintsData.push({ id: doc.id, ...doc.data() });
        });
        setComplaints(complaintsData);
      });
  
      return () => unsubscribe();
    }
  }, [currentUser]);  

  const pieData = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Status",
        data: [
          complaints.filter((c) => c.status === "Open").length,
          complaints.filter((c) => c.status === "In Progress").length,
          complaints.filter((c) => c.status === "Resolved").length,
          complaints.filter((c) => c.status === "Closed").length,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: [...new Set(complaints.map((complaint) => complaint.issue))],
    datasets: [
      {
        label: "Complaints",
        data: complaints.reduce((acc, complaint) => {
          const index = acc.labels.indexOf(complaint.issue);
          acc.data[index] += 1;
          return acc;
        }, { labels: [...new Set(complaints.map((complaint) => complaint.issue))], data: Array([...new Set(complaints.map((complaint) => complaint.issue))].length).fill(0) }).data,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnalysisResult(null);
    setComplaintText("");
    setInputType("");
  };

  const handleInputTypeChange = (event) => {
    setInputType(event.target.value);
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleAnalyze = (result) => {
    setAnalysisResult(result);
    setComplaintText(result.text || "");
  };

  const handleBack = () => {
    setAnalysisResult(null);
  };

  const handleFinalSubmit = async (finalResult) => {
    try {
      // Save the finalResult to Firestore
      await addDoc(collection(db, "complaints"), finalResult);
      alert("Complaint submitted successfully!");
      handleCloseDialog(); 
    } catch (error) {
      console.error("Error adding complaint to Firestore:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,  // Reduced height for better balance
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Complaints
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {complaints.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Complaints Status
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Doughnut data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Complaints by Category
            </Typography>
            <Box sx={{ width: "100%", height: "100%" }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Complaints
              </Typography>
              <TextField
                variant="outlined"
                label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select value={filterStatus} onChange={handleFilterChange}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <ComplaintList
              complaints={complaints}
              onComplaintClick={handleComplaintClick}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              selectedComplaintId={selectedComplaint?.id}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedComplaint && (
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: '100%' }}>
              <ComplaintDetails complaint={selectedComplaint} />
            </Paper>
          )}
        </Grid>
      </Grid>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        Add Complaint
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {analysisResult ? "Complaint Preview" : "Add Complaint"}
        </DialogTitle>
        <DialogContent>
          {analysisResult ? (
            <ComplaintPreview
              analysisResult={analysisResult}
              onBack={handleBack}
              onSubmit={handleFinalSubmit}
            />
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="input-type-label">Input Type</InputLabel>
                <Select
                  labelId="input-type-label"
                  id="input-type-select"
                  value={inputType}
                  label="Input Type"
                  onChange={handleInputTypeChange}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="voice">Voice</MenuItem>
                  <MenuItem value="image">Text & Picture</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                </Select>
              </FormControl>
              {inputType && (
                <ComplaintForm
                  inputType={inputType}
                  onAnalyze={handleAnalyze}
                  initialText={complaintText}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

