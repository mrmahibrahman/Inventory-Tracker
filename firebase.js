// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}   from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR-HMVcntVQDO5PtJ2B5hr-O71qn6xYLM",
  authDomain: "inventory-management-11a9e.firebaseapp.com",
  projectId: "inventory-management-11a9e",
  storageBucket: "inventory-management-11a9e.appspot.com",
  messagingSenderId: "771300334065",
  appId: "1:771300334065:web:8181563450191392654c50",
  measurementId: "G-1JSLFXRLZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Export firestore to access the firestore files
export {firestore};
export const auth = getAuth(app);
export default app