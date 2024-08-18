import { useState } from "react";
import { Box, Button } from "@mui/material";
import TextInput from "./inputTypes/TextInput";
import VoiceInput from "./inputTypes/VoiceInput";
import ImageInput from "./inputTypes/ImageInput";
import VideoInput from "./inputTypes/VideoInput";

const ComplaintForm = ({ inputType, onAnalyze, initialText = "" }) => {
  const [complaintData, setComplaintData] = useState({
    text: initialText,
    file: null,
  });

  const handleChange = (newData) => {
    setComplaintData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", complaintData.text);
    if (complaintData.file) {
      formData.append("file", complaintData.file);
    }

    const result = await analyzeComplaint(formData);
    onAnalyze(result, complaintData.text);
  };

  const analyzeComplaint = async (formData) => {
    try {
      const response = await fetch("/api/analyzeComplaint", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to analyze complaint");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error analyzing complaint:", error);
      return { error: error.message };
    }
  };

  const renderInputComponent = () => {
    switch (inputType) {
      case "text":
        return <TextInput value={complaintData.text} onChange={handleChange} />;
      case "voice":
        return <VoiceInput onChange={handleChange} />;
      case "image":
        return <ImageInput onChange={handleChange} />;
      case "video":
        return <VideoInput onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {renderInputComponent()}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Analyze Complaint
      </Button>
    </Box>
  );
};

export default ComplaintForm;