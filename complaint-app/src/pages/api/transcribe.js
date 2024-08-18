import { SpeechClient } from "@google-cloud/speech";
import fs from "fs";
import multer from "multer";

const upload = multer({ dest: "/tmp/" });
const speechClient = new SpeechClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading file" });
      }

      const audioBytes = fs.readFileSync(req.file.path).toString("base64");

      const audio = {
        content: audioBytes,
      };
      const config = {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
      };
      const request = {
        audio: audio,
        config: config,
      };

      try {
        const [response] = await speechClient.recognize(request);
        const transcription = response.results
          .map((result) => result.alternatives[0].transcript)
          .join("\n");

        fs.unlinkSync(req.file.path);
        res.status(200).json({ transcription });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error transcribing audio" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
