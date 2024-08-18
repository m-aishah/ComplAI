import { useState, useRef, useEffect } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteIcon from "@mui/icons-material/Delete";

const VoiceInput = ({ onChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange({ file: blob, text: "Voice recording" });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();
      visualize(stream);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    const startTime = Date.now();
    const updateTimer = () => {
      const elapsedTime = Date.now() - startTime;
      setRecordingTime(Math.floor(elapsedTime / 1000));
      if (isRecording) {
        requestAnimationFrame(updateTimer);
      }
    };
    requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    cancelAnimationFrame(animationRef.current);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const visualize = (stream) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    analyser.current = audioContext.current.createAnalyser();
    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);
    analyser.current.fftSize = 256;
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.current.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, width, height);
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        canvasCtx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`;
        canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
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
    onChange({ file: null, text: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {/* <canvas ref={canvasRef} width="300" height="60" /> */}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
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
          </>
        )}
      </Box>
      <Typography variant="body2" align="center">
        {isRecording ? `Recording: ${formatTime(recordingTime)}` : "Not recording"}
      </Typography>
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
    </Box>
  );
};

export default VoiceInput;