import React, { useState } from 'react';
import { Typography, Paper, IconButton, Divider, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

export default function ComplaintDetails({ complaint, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableComplaint, setEditableComplaint] = useState(complaint);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableComplaint({ ...editableComplaint, [name]: value });
  };

  const handleSave = () => {
    // Implement save logic here
    console.log('Saved complaint:', editableComplaint);
    setIsEditing(false);
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        Complaint Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {!isEditing ? (
        <>
          <Typography variant="body1"><strong>Customer:</strong> {editableComplaint.customer}</Typography>
          <Typography variant="body1"><strong>Issue:</strong> {editableComplaint.issue}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {editableComplaint.status}</Typography>
          <IconButton sx={{ mt: 2 }} color="primary" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </>
      ) : (
        <>
          <TextField
            label="Customer"
            name="customer"
            value={editableComplaint.customer}
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
            label="Status"
            name="status"
            value={editableComplaint.status}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            Save
          </Button>
        </>
      )}
    </Paper>
  );
}