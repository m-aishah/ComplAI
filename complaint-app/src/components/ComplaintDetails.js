import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export default function ComplaintDetails({ complaint, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableComplaint, setEditableComplaint] = useState(complaint);

  
  useEffect(() => {
    setEditableComplaint(complaint);
  }, [complaint]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableComplaint({ ...editableComplaint, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Update the complaint in Firestore
      const complaintRef = doc(db, "complaints", editableComplaint.id);
      await updateDoc(complaintRef, {
        customerName: editableComplaint.customerName,
        issue: editableComplaint.issue,
        status: editableComplaint.status,
        product: editableComplaint.product,
        subProduct: editableComplaint.subProduct,
        subIssue: editableComplaint.subIssue,
        // Add other fields that you want to update
      });
      console.log("Complaint updated successfully");
    } catch (error) {
      console.error("Error updating complaint:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete the complaint from Firestore
      const complaintRef = doc(db, "complaints", editableComplaint.id);
      await deleteDoc(complaintRef);
      console.log("Complaint deleted successfully");
      
      onDelete(editableComplaint.id);
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Complaint Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {!isEditing ? (
        <>
          <Typography variant="body1">
            <strong>Customer:</strong> {editableComplaint.customerName}
          </Typography>
          <Typography variant="body1">
            <strong>Product:</strong> {editableComplaint.product}
          </Typography>
          <Typography variant="body1">
            <strong>Sub-Product:</strong> {editableComplaint.subProduct}
          </Typography>
          <Typography variant="body1">
            <strong>Issue:</strong> {editableComplaint.issue}
          </Typography>
          <Typography variant="body1">
            <strong>Sub-Issue:</strong> {editableComplaint.subIssue}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {editableComplaint.status}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <IconButton color="primary" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <TextField
            label="Customer"
            name="customerName"
            value={editableComplaint.customerName}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Product"
            name="product"
            value={editableComplaint.product}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sub-Product"
            name="subProduct"
            value={editableComplaint.subProduct}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Issue"
            name="issue"
            value={editableComplaint.issue}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sub-Issue"
            name="subIssue"
            value={editableComplaint.subIssue}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Status"
            name="status"
            value={editableComplaint.status}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </>
      )}
    </Paper>
  );
}
