import { analyzeComplaint } from "@/lib/complaintAnalysis";
import multer from "multer";
import { createWorker } from "tesseract.js";

const upload = multer({ dest: "/tmp/" });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading file" });
      }

      let extractedText = req.body.text || "";

      if (req.file) {
        const fileType = req.file.mimetype;
        if (fileType.startsWith("image/")) {
          // Process image with Tesseract.js
          const worker = await createWorker();
          await worker.loadLanguage("eng");
          await worker.initialize("eng");
          const {
            data: { text: ocrText },
          } = await worker.recognize(req.file.path);
          await worker.terminate();
          extractedText += " " + ocrText;
        } else if (fileType === "audio/webm" || fileType.startsWith("audio/")) {
          // For voice input, we assume the text has already been transcribed
          // and sent in the 'text' field of the request body
          // No additional processing needed here
        } else {
          return res.status(400).json({ error: "Unsupported file type" });
        }
      }

      try {
        const result = await analyzeComplaint(extractedText);
        res.status(200).json(result);
      } catch (error) {
        console.error("Error in API route:", error);
        res.status(500).json({
          error: "Internal server error",
          details: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} is not allowed`);
  }
};

export default handler;
