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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ComplaintDetails from "../../components/ComplaintDetails";
import ComplaintForm from "../../components/ComplaintForm";
import ComplaintList from "../../components/ComplaintList";
import Layout from "../../components/Layout";
import ComplaintPreview from "../../components/ComplaintPreview";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const pieData = [
  { name: "Open", value: 32 },
  { name: "In Progress", value: 52 },
  { name: "Resolved", value: 47 },
  { name: "Closed", value: 40 },
];

const barData = [
  { name: "Billing", complaints: 65 },
  { name: "Product", complaints: 45 },
  { name: "Service", complaints: 98 },
  { name: "Delivery", complaints: 39 },
  { name: "Other", complaints: 43 },
];

export default function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [inputType, setInputType] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [complaintText, setComplaintText] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!selectedComplaint && barData.length > 0) {
      setSelectedComplaint(barData[0]);
    }
  }, [selectedComplaint]);

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
    console.log("Selected complaint:", complaint);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleAnalyze = (result, text) => {
    setAnalysisResult(result);
    setComplaintText(text);
  };

  const handleBack = () => {
    setAnalysisResult(null);
  };

  const handleFinalSubmit = (finalResult) => {
    // Handle final submission here
    console.log("Final submission:", finalResult);
    // You might want to send this data to your backend or update state
    handleCloseDialog();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
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
                171
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
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
                <PieChart width={160} height={160}>
                  <Pie
                    data={pieData}
                    cx={80}
                    cy={80}
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
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
                <BarChart
                  width={500}
                  height={240}
                  data={barData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="complaints" fill="#8884d8" />
                </BarChart>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
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
                onComplaintClick={handleComplaintClick}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                selectedComplaintId={selectedComplaint?.id}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            {selectedComplaint && (
              <ComplaintDetails complaint={selectedComplaint} />
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
        <DialogTitle>{analysisResult ? "Complaint Preview" : "Add Complaint"}</DialogTitle>
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