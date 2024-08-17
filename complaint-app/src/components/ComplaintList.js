import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';

const complaints = [
  { id: 1, customer: 'John Doe', issue: 'Billing error', status: 'Open' },
  { id: 2, customer: 'Jane Smith', issue: 'Product malfunction', status: 'In Progress' },
  // Add more mock data as needed
];

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ComplaintList({ onComplaintClick, searchTerm, filterStatus, selectedComplaintId }) {
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
            <StyledTableRow 
              key={complaint.id}
              onClick={() => onComplaintClick(complaint)}
              selected={complaint.id === selectedComplaintId}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.customer}</TableCell>
              <TableCell>{complaint.issue}</TableCell>
              <TableCell>{complaint.status}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
