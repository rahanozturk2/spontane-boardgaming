import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebaseConfig";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function Login() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <h2>Kullanıcı Girişi</h2>
      {user ? (
        <p>Hoş geldin, {user.displayName || user.email}</p>
      ) : (
        <>
          <button onClick={handleGoogleLogin}>Google ile Giriş Yap</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default Login;
