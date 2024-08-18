import { useState, useCallback } from "react";
import { Button, Box, Typography, TextField, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";

const VideoInput = ({ onChange }) => {
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      onChange({ file, text });
    }
  }, [onChange, text]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/*",
    multiple: false,
  });

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange({ file: preview ? preview.file : null, text: e.target.value });
  };

  const removeVideo = () => {
    setPreview(null);
    onChange({ file: null, text });
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 2,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: isDragActive ? "#f0f0f0" : "transparent",
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Box sx={{ position: "relative" }}>
            <video src={preview} controls style={{ maxWidth: "100%", maxHeight: 200, display: "block", margin: "0 auto" }} />
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                removeVideo();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 48, color: "#999" }} />
            <Typography>
              {isDragActive ? "Drop the video here" : "Drag & drop a video here, or click to select"}
            </Typography>
          </Box>
        )}
      </Box>
      <TextField
        value={text}
        onChange={handleTextChange}
        placeholder="Add optional description..."
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        margin="normal"
      />
    </Box>
  );
};

export default VideoInput;