import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Mock data - replace with actual data fetching logic
const complaints = [
  { id: 1, customer: 'John Doe', issue: 'Billing error', status: 'Open' },
  { id: 2, customer: 'Jane Smith', issue: 'Product malfunction', status: 'In Progress' },
  // Add more mock data as needed
];

export default function ComplaintList({ onComplaintClick, searchTerm, filterStatus }) {
  const filteredComplaints = complaints.filter(complaint => 
    complaint.customer.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus ? complaint.status === filterStatus : true)
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredComplaints.map((complaint) => (
            <TableRow 
              key={complaint.id} 
              onClick={() => onComplaintClick(complaint)} 
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.customer}</TableCell>
              <TableCell>{complaint.issue}</TableCell>
              <TableCell>{complaint.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}