import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const ComplaintForm = ({ inputType, onAnalyze, initialText = "" }) => {
  const [complaintText, setComplaintText] = useState(initialText);

  const handleChange = (e) => {
    setComplaintText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await analyzeComplaint(complaintText);
    onAnalyze(result, complaintText);
  };

  const analyzeComplaint = async (text) => {
    try {
      const response = await fetch("/api/analyzeComplaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to analyze text");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error analyzing text:", error);
      return { error: error.message };
    }
  };

  return (
    <Box>
    <form onSubmit={handleSubmit}>
      <TextField
        value={complaintText}
        onChange={handleChange}
        placeholder="Enter your complaint here..."
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Analyze Complaint
      </Button>
    </form>
  </Box>
);
};

export default ComplaintForm;