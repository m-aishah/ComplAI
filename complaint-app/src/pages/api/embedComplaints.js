import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import path from 'path';
import fs from 'fs/promises';

const VECTOR_STORE_PATH = 'data/vectorstore';
const JSON_FILE_PATH = 'data/complaints.json'; // Path to your JSON file
const BATCH_SIZE = 3; // Adjust this based on your rate limit (e.g., 3 requests per minute)
const DELAY_MS = 60000; // 1-minute delay between batches

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase limit to handle larger files
    },
  },
};

async function processBatch(splitDocs, embeddings) {
  const batch = splitDocs.splice(0, BATCH_SIZE);
  const vectorStore = await HNSWLib.fromDocuments(batch, embeddings);
  await vectorStore.save(VECTOR_STORE_PATH);
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const filePath = path.resolve(JSON_FILE_PATH);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const complaints = JSON.parse(fileContent);

      const validComplaints = complaints
        .map(c => c._source?.complaint_what_happened)
        .filter(text => typeof text === 'string' && text.trim().length > 0);

      if (validComplaints.length === 0) {
        throw new Error("No valid complaint texts found.");
      }

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
      });

      const splitDocs = await textSplitter.createDocuments(validComplaints);
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      // Batch processing with delay
      while (splitDocs.length > 0) {
        await processBatch(splitDocs, embeddings);
        if (splitDocs.length > 0) {
          console.log(`Processed a batch, waiting for ${DELAY_MS / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error embedding complaints:", error);
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
