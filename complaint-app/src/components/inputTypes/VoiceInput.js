import DeleteIcon from "@mui/icons-material/Delete";
import MicIcon from "@mui/icons-material/Mic";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const VoiceInput = ({ onChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const audioBlob = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        audioBlob.current = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob.current);
        setAudioUrl(url);
        setIsAnalyzed(false);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const transcribeAudio = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.transcription;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      return "Error transcribing audio";
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setIsPlaying(false);
    setIsAnalyzed(false);
    onChange({ file: null, text: "" });
  };

  const handleAnalyze = async () => {
    if (!audioUrl) return;

    const transcription = await transcribeAudio(audioBlob.current);
    onChange({ file: audioBlob.current, text: transcription });
    setIsAnalyzed(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {/* <canvas ref={canvasRef} width="300" height="60" /> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        {!audioUrl ? (
          <Button
            variant="contained"
            color={isRecording ? "secondary" : "primary"}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        ) : (
          <>
            <IconButton onClick={togglePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={deleteRecording}>
              <DeleteIcon />
            </IconButton>
            {!isAnalyzed && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalyze}
              >
                Analyze
              </Button>
            )}
          </>
        )}
      </Box>
      <Typography variant="body2" align="center">
        {isRecording ? `Recording: ${recordingTime}s` : "Not recording"}
      </Typography>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </Box>
  );
};

export default VoiceInput;
