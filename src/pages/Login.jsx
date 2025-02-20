import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig"; // 🔴 `auth`'ı direkt buradan alıyoruz!
import { useAuth } from "../context/AuthContext"; // 🔴 Kullanıcı yönetimi için `useAuth`'ı alıyoruz

const googleProvider = new GoogleAuthProvider();

function Login() {
  const { user, logout } = useAuth(); // 🔴 Kullanıcı bilgisi ve çıkış fonksiyonunu al
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Giriş başarılı!", result.user);
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Kullanıcı Girişi</h2>
      {user ? (
        <>
          <p>Hoş geldin, {user.displayName || user.email}!</p>
          <button onClick={logout}>Çıkış Yap</button> {/* 🔴 Çıkış butonu */}
        </>
      ) : (
        <>
          <button onClick={handleGoogleLogin}>Google ile Giriş Yap</button> {/* 🔴 Giriş butonu */}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default Login;
