import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";

const ComplaintForm = () => {
  const [complaintText, setComplaintText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const handleChange = (e) => {
    setComplaintText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnalysisResult(null);
    const result = await analyzeComplaint(complaintText);
    setAnalysisResult(result);
    setAnalysisHistory((prevHistory) => [...prevHistory, result]);
    setComplaintText("");
  };

  const analyzeComplaint = async (text) => {
    try {
      const response = await fetch("/api/analyzeComplaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to analyze text");
      }
      const result = await response.json();
      setAnalysisResult(result);
      console.log(result);

      if (result.isComplaint) {
        await saveToFirebase(result);
      }
      return result;
    } catch (error) {
      console.error("Error analyzing text:", error);
      return { error: error.message };
    }
  };

  const saveToFirebase = async (complaintData) => {
    try {
      const db = getFirestore();
      const complaintToSave = {
        title: complaintData.title,
        status: complaintData.status,
        customerName: complaintData.customerName,
        product: complaintData.product,
        subProduct: complaintData.subProduct,
        issue: complaintData.issue,
        subIssue: complaintData.subIssue,
        timestamp: new Date(),
      };
      const docRef = await addDoc(
        collection(db, "complaints"),
        complaintToSave
      );
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error saving to Firebase:", error);
    }
  };

  return (
    <div className="complaint-form">
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={complaintText}
          onChange={handleChange}
          placeholder="Enter your complaint here..."
          rows="10"
          style={{ width: "100%", minHeight: "200px" }}
          required
        />
        <button type="submit">Analyze Complaint</button>
      </form>

      {analysisResult && (
        <div className="analysis-result">
          <h3>Latest Analysis Result:</h3>
          {analysisResult.error ? (
            <p>{analysisResult.error}</p>
          ) : (
            <>
              <p>
                {analysisResult.isComplaint
                  ? "This is a complaint."
                  : "This is not a complaint."}
              </p>
              {analysisResult.isComplaint && (
                <>
                  <p>Title: {analysisResult.title}</p>
                  <p>Status: {analysisResult.status}</p>
                  <p>Customer Name: {analysisResult.customerName}</p>
                  <p>Product: {analysisResult.product}</p>
                  <p>Sub-Product: {analysisResult.subProduct}</p>
                  <p>Issue: {analysisResult.issue}</p>
                  <p>Sub-Issue: {analysisResult.subIssue}</p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
