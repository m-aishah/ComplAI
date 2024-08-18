import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}
