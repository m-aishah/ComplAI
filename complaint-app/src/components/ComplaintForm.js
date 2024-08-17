import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

export default function ComplaintForm({ inputType }) {
  const [complaintData, setComplaintData] = useState({});

  const handleInputChange = (event) => {
    setComplaintData({ ...complaintData, [event.target.name]: event.target.value });
  };

  const handleFileUpload = (event) => {
    // Handle file upload logic here
  };

  const handleVoiceInput = () => {
    // Implement voice input logic using Web Speech API
  };

  switch (inputType) {
    case 'text':
      return (
        <Box>
          <TextField
            fullWidth
            margin="normal"
            name="complaint"
            label="Complaint Details"
            multiline
            rows={4}
            onChange={handleInputChange}
          />
        </Box>
      );
    case 'voice':
      return (
        <Box>
          <Button onClick={handleVoiceInput}>Start Voice Input</Button>
          {/* Add transcription display here */}
        </Box>
      );
    case 'image':
    case 'video':
      return (
        <Box>
          <input
            accept={inputType === 'image' ? "image/*" : "video/*"}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload {inputType === 'image' ? 'Image' : 'Video'}
            </Button>
          </label>
        </Box>
      );
    default:
      return null;
  }
}