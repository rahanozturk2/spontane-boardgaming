import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBHfyqV_w4vyTOo6LU4YxnMQUhYQh0R6ic",
  authDomain: "spontane-board.firebaseapp.com",
  projectId: "spontane-board",
  storageBucket: "spontane-board.firebasestorage.app",
  messagingSenderId: "826639970085",
  appId: "1:826639970085:web:b328a8dc74902f9025b4cc",
  measurementId: "G-JYPVNV9RGR"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

export default app; // 🔴 Bunu eklediğinden emin ol!
