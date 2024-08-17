import { auth } from '../../../lib/firebase'; // Adjust the path if necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    console.error('Signup failed:', error.message);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
}
