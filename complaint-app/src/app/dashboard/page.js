'use client'
import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, MenuItem, 
  Select, FormControl, InputLabel, IconButton, TextField, Divider
} from '@mui/material';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import Layout from '../../components/Layout';
import ComplaintList from '../../components/ComplaintList';
import ComplaintDetails from '../../components/ComplaintDetails';
import ComplaintForm from '../../components/ComplaintForm';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const pieData = [
  { name: 'Open', value: 32 },
  { name: 'In Progress', value: 52 },
  { name: 'Resolved', value: 47 },
  { name: 'Closed', value: 40 },
];

const barData = [
  { name: 'Billing', complaints: 65 },
  { name: 'Product', complaints: 45 },
  { name: 'Service', complaints: 98 },
  { name: 'Delivery', complaints: 39 },
  { name: 'Other', complaints: 43 },
];

export default function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [inputType, setInputType] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  
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

  if (!isClient) {
    return null; 
  }

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
              <Typography variant="h6" gutterBottom>
                Total Complaints
              </Typography>
              <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                171
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
              <Typography variant="h6" gutterBottom>
                Complaints Status
              </Typography>
              <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
              <Typography variant="h6" gutterBottom>
                Complaints by Category
              </Typography>
              <Box sx={{ width: '100%', height: '100%' }}>
                <BarChart
                  width='100%'
                  height='100%'
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
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
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
                  <Select
                    value={filterStatus}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ComplaintList onComplaintClick={handleComplaintClick} searchTerm={searchTerm} filterStatus={filterStatus} />
            </Paper>
          </Grid>
          {selectedComplaint && (
            <Grid item xs={12} md={6}>
              <ComplaintDetails 
                complaint={selectedComplaint} 
                onClose={() => setSelectedComplaint(null)}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Complaint</DialogTitle>
        <DialogContent>
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
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
          </FormControl>
          {inputType && <ComplaintForm inputType={inputType} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
