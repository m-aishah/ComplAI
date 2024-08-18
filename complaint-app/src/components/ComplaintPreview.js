import React, { useState } from 'react';
import { Card, CardContent, CardActions, IconButton, TextField, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ComplaintPreview({ analysisResult, onEdit, onBack, onSubmit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableResult, setEditableResult] = useState(analysisResult);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableResult((prevResult) => ({ ...prevResult, [name]: value }));
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  // TODO: Implement final submit logic - store in firebase.
  const handleFinalSubmit = () => {
    onSubmit(editableResult);
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardActions>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleEditToggle}>
          <EditIcon />
        </IconButton>
      </CardActions>
      <CardContent>
        {/* <Typography variant="h6">Complaint Preview</Typography> */}
        {analysisResult.error ? (
          <Typography color="error">{analysisResult.error}</Typography>
        ) : (
          <>
            {Object.entries(editableResult).map(([key, value]) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={value}
                onChange={handleFieldChange}
                fullWidth
                sx={{ mb: 2 }}
                disabled={!isEditing}
              />
            ))}
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" color="primary" onClick={handleFinalSubmit} sx={{ ml: 2 }}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}