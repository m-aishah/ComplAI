import openai from "./openai";

export async function analyzeComplaint(complaintText) {
  try {
    console.log("Analyzing complaint:", complaintText);
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that analyzes customer complaints and extracts specific information.",
        },
        {
          role: "user",
          content: `Analyze the following complaint and extract the following information:
            1. Customer Name
            2. Product (general category of the complaint, e.g., "Credit card")
            3. Sub-Product (more specific category, e.g., "Store credit card" or "General-purpose credit card")
            4. Issue (main problem, e.g., "Problem with a purchase shown on your statement")
            5. Sub-Issue (more detail about the issue, e.g., "Overcharged for something you did purchase with the card")

            Complaint text: ${complaintText}

            Provide the extracted information in a JSON format. If you can't determine a specific field, use "Unknown" as the value.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log("OpenAI response:", response);
    const result = JSON.parse(response.choices[0].message.content);

    return {
      isComplaint: true,
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
