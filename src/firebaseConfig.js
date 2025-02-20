import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHfyqV_w4vyTOo6LU4YxnMQUhYQh0R6ic",
  authDomain: "spontane-board.firebaseapp.com",
  projectId: "spontane-board",
  storageBucket: "spontane-board.appspot.com", // 🔴 HATA VARDI! ".app" değil ".appspot.com" olmalı!
  messagingSenderId: "826639970085",
  appId: "1:826639970085:web:b328a8dc74902f9025b4cc",
  measurementId: "G-JYPVNV9RGR"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
