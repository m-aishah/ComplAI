import openai from "./openai";

export async function analyzeComplaint(
  complaintText = "No complaint text provided"
) {
  try {
    console.log("COmplaint text:", complaintText);
    console.log("Analyzing text:", complaintText);
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that analyzes customer complaints. Please respond with a JSON object containing the following fields: isComplaint (boolean), title, customerName, product, subProduct, issue, subIssue and status.",
        },
        {
          role: "user",
          content: complaintText,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
      // response_format: { type: "json_object" },
    });

    console.log("OpenAI response:", response);
    const result =
      typeof response.choices[0].message.content === "object"
        ? response.choices[0].message.content
        : JSON.parse(response.choices[0].message.content);

    return {
      isComplaint: result.isComplaint,
      title: result.title || "Unknown",
      customerName: result.customerName || "Unknown",
      product: result.product || "Unknown",
      subProduct: result.subProduct || "Unknown",
      issue: result.issue || "Unknown",
      subIssue: result.subIssue || "Unknown",
      status: result.status || "Unknown",
    };
  } catch (error) {
    console.error("Error in analyzeComplaint:", error);
    if (error.response) {
      console.error("OpenAI API error:", error.response.data);
    }
    throw error;
  }
}

// FOR RAG

// import openai from "./openai";
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import path from 'path';
// import fs from 'fs/promises';

// const VECTOR_STORE_PATH = 'data/vectorstore';
// const VECTOR_STORE_SPACE = 'cosine'; // Distance metric for HNSWLib

// // Load the vector store or create it if it doesn't exist
// async function loadVectorStore() {
//   try {
//     const embeddings = new OpenAIEmbeddings({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, embeddings, {
//       space: VECTOR_STORE_SPACE,
//     });

//     return vectorStore;
//   } catch (error) {
//     console.error("Error loading vector store:", error);
//     throw new Error("Could not load vector store");
//   }
// }

// // Standard GPT-4 analysis combined with retrieved documents
// export async function analyzeComplaint(complaintText = "No complaint text provided") {
//   try {
//     // Load the vector store
//     const vectorStore = await loadVectorStore();

//     // Retrieve similar documents from the vector store
//     const retrievedDocs = await vectorStore.similaritySearch(complaintText, 5);
//     const context = retrievedDocs.map(doc => doc.pageContent).join("\n\n");

//     // Use the retrieved context along with the user prompt
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system", 
//           content: `
//             You are a helpful assistant that analyzes customer complaints. 
//             Use the following context to enhance your analysis. 
//             Context: "${context}". 
//             Please respond with a JSON object containing the following fields: 
//             isComplaint (boolean), title, customerName, product, subProduct, issue, subIssue, and status.
//           `,
//         },
//         {
//           role: "user",
//           content: complaintText,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 200,
//       response_format: { type: "json_object" },
//     });

//     const result =
//       typeof response.choices[0].message.content === "object"
//         ? response.choices[0].message.content
//         : JSON.parse(response.choices[0].message.content);

//     return {
//       isComplaint: result.isComplaint,
//       title: result.title || "Unknown",
//       customerName: result.customerName || "Unknown",
//       product: result.product || "Unknown",
//       subProduct: result.subProduct || "Unknown",
//       issue: result.issue || "Unknown",
//       subIssue: result.subIssue || "Unknown",
//       status: result.status || "Unknown",
//     };
//   } catch (error) {
//     console.error("Error in analyzeComplaint:", error);
//     throw error;
//   }
// }
