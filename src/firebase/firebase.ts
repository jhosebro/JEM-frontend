// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeSK7iZcCHH6Sl_fQaSV9LR4_cTW0fZqQ",
  authDomain: "jdl-event-manager.firebaseapp.com",
  projectId: "jdl-event-manager",
  storageBucket: "jdl-event-manager.firebasestorage.app",
  messagingSenderId: "127559145438",
  appId: "1:127559145438:web:5402fb5711b4416729af4f",
  measurementId: "G-5FPK55XDMN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
export {auth, db};