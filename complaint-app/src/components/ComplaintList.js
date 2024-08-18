import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
  backgroundColor: selected
    ? theme.palette.action.selected
    : theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ComplaintList({
  complaints,
  onComplaintClick,
  searchTerm,
  filterStatus,
  selectedComplaintId,
}) {
  // Filter complaints based on search term and status
  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus ? complaint.status === filterStatus : true)
  );
  
  console.log("Complaints in complaintList:", complaints);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredComplaints.map((complaint, index) => (
            <StyledTableRow
              key={complaint.id}
              onClick={() => onComplaintClick(complaint)}
              selected={complaint.id === selectedComplaintId}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{complaint.customerName || "Unknown Customer"}</TableCell>
              <TableCell>{complaint.issue || "No Issue Specified"}</TableCell>
              <TableCell>{complaint.status || "Unknown Status"}</TableCell>
              <TableCell>{complaint.category || "No Category"}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}