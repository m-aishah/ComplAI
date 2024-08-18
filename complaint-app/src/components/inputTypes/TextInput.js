import { useState, useEffect } from 'react';
import { TextField, IconButton, InputAdornment, Typography, Box } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

const TextInput = ({ value, onChange }) => {
  const [text, setText] = useState(value);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onChange({ text: newText });
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        setText(fileContent);
        onChange({ text: fileContent, file: uploadedFile });
      };
      reader.readAsText(uploadedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setText('');
    onChange({ text: '', file: null });
  };

  return (
    <Box>
      <TextField
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your complaint here..."
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <input
                accept=".txt,.doc,.docx,.pdf"
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="icon-button-file">
                <IconButton component="span">
                  <AttachFileIcon />
                </IconButton>
              </label>
            </InputAdornment>
          ),
        }}
      />
      {file && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f0f0f0', p: 1, borderRadius: 1 }}>
          <Typography variant="body2">{file.name}</Typography>
          <IconButton size="small" onClick={removeFile}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TextInput;