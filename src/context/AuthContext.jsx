import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // 🔴 signOut eklendi!
import { auth } from "../firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔴 Kullanıcı Çıkış Yapma Fonksiyonu
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Kullanıcı çıkış yaptı!");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Kullanıcı bilgisi almak için özel hook
export const useAuth = () => {
  return useContext(AuthContext);
};
