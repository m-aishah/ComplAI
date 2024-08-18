import openai from "./openai";

export async function analyzeComplaint(complaintText) {
  try {
    console.log("Analyzing text:", complaintText);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that analyzes customer complaints. Please respond with a JSON object containing the following fields: isComplaint (boolean), customerName, product, subProduct, issue, and subIssue.",
        },
        {
          role: "user",
          content: complaintText,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    console.log("OpenAI response:", response);
    const result =
      typeof response.choices[0].message.content === "object"
        ? response.choices[0].message.content
        : JSON.parse(response.choices[0].message.content);

    return {
      isComplaint: result.isComplaint,
      customerName: result.customerName || "Unknown",
      product: result.product || "Unknown",
      subProduct: result.subProduct || "Unknown",
      issue: result.issue || "Unknown",
      subIssue: result.subIssue || "Unknown",
    };
  } catch (error) {
    console.error("Error in analyzeComplaint:", error);
    if (error.response) {
      console.error("OpenAI API error:", error.response.data);
    }
    throw error;
  }
}
