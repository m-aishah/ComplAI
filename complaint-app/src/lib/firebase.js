// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbKM9hgOInrLiwVsvyIFrvlwhWRMON1TA",
  authDomain: "complaints-ffb19.firebaseapp.com",
  projectId: "complaints-ffb19",
  storageBucket: "complaints-ffb19.appspot.com",
  messagingSenderId: "55626241032",
  appId: "1:55626241032:web:7798bbbead5cf535cdadbd",
  measurementId: "G-ZWQR22EHZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
