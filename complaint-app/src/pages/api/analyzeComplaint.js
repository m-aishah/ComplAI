import { analyzeComplaint } from "@/lib/complaintAnalysis";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { text } = req.body;

      if (!text) {
        return res
          .status(400)
          .json({ error: "Missing 'text' in request body" });
      }

      const result = await analyzeComplaint(text);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in API route:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} is not allowed`);
  }
}
