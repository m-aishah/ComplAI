import { Box, Button } from "@mui/material";
import { useCallback, useState } from "react";
import ImageInput from "./inputTypes/ImageInput";
import TextInput from "./inputTypes/TextInput";
import VideoInput from "./inputTypes/VideoInput";
import VoiceInput from "./inputTypes/VoiceInput";

const ComplaintForm = ({ inputType, onAnalyze, initialText = "" }) => {
  const [complaintData, setComplaintData] = useState({
    text: initialText,
    file: null,
  });

  const handleChange = useCallback((newData) => {
    setComplaintData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (complaintData.text) {
      const result = await analyzeComplaint(complaintData.text);
      onAnalyze(result);
    }
  };

  const analyzeComplaint = async (text) => {
    console.log("Text for analysis:", text);
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
        throw new Error(errorData.error || "Failed to analyze complaint");
      }
      const result = await response.json();
      console.log("Analysis result:", result);
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
