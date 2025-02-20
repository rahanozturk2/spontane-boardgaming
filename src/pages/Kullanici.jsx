import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";

const auth = getAuth(app);

function Kullanici() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <h1>Hoş geldin, {user.displayName || user.email}!</h1>
      ) : (
        <h1>Spontane Boardgaming kullanıcılarına özel</h1>
      )}
    </div>
  );
}

export default Kullanici;
