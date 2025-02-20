import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; 
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, getDocs } from "firebase/firestore";

function Açıklamalar() {
  const [gameName, setGameName] = useState(""); 
  const [games, setGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(null);

  // 📌 Firestore'dan oyunları gerçek zamanlı dinle
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "games"), (snapshot) => {
      const gamesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(gamesList);
    });

    return () => unsubscribe(); // Bileşen kaldırıldığında dinlemeyi durdur
  }, []);

  // 📌 Yeni oyun ekleme fonksiyonu
  const handleAddGame = async () => {
    if (gameName.trim() === "") return; 
    try {
      await addDoc(collection(db, "games"), { name: gameName });
      setGameName(""); // Input'u temizle
    } catch (error) {
      console.error("Oyun eklenemedi:", error);
    }
  };

  // 📌 Oyun ve puanlarını Firestore'dan kaldırma
  const handleDeleteGame = async (gameId, gameName) => {
    try {
      // **1️⃣ Firestore "games" koleksiyonundan oyunu kaldır**
      await deleteDoc(doc(db, "games", gameId));
      console.log(`Oyun silindi: ${gameName}`);

      // **2️⃣ "ratings" koleksiyonundan ilgili puanları temizle**
      const ratingsQuery = query(collection(db, "ratings"), where("game", "==", gameName));
      const ratingsSnapshot = await getDocs(ratingsQuery);

      if (!ratingsSnapshot.empty) {
        ratingsSnapshot.forEach(async (ratingDoc) => {
          await deleteDoc(doc(db, "ratings", ratingDoc.id));
          console.log(`Silinen puan: ${ratingDoc.id}`);
        });
      }

      alert(`"${gameName}" oyunu ve puanları başarıyla kaldırıldı.`);
    } catch (error) {
      console.error("🔥 Hata: Oyun silinemedi:", error);
      alert("Bir hata oluştu, tekrar deneyin.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Açıklamalar Sayfası</h2>

      {/* Oyun Ekleme Input ve Butonu */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Oyun Adı"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid gray"
          }}
        />
        <button
          onClick={handleAddGame}
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#28a745",
            color: "white"
          }}
        >
          Ekle
        </button>
      </div>

      {/* Firebase'den Çekilen Oyun Listesi */}
      <h3>Eklenen Oyunlar:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {games.map((game) => (
          <li 
            key={game.id} 
            onClick={() => setSelectedGame(selectedGame === game.id ? null : game.id)} 
            style={{ 
              fontSize: "18px", 
              margin: "10px 0", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              cursor: "pointer",
              background: selectedGame === game.id ? "#444" : "transparent",
              padding: "5px 10px",
              borderRadius: "5px"
            }}
          >
            <span>{game.name}</span>

            {/* Menü Butonu */}
            <div style={{ position: "relative", marginLeft: "10px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  setSelectedGame(selectedGame === game.id ? null : game.id);
                }}
                style={{
                  padding: "5px",
                  fontSize: "14px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  border: "none",
                  background: "#555",
                  color: "white"
                }}
              >
                ☰
              </button>

              {/* Silme Menüsü */}
              {selectedGame === game.id && (
                <div style={{
                  position: "absolute",
                  top: "30px",
                  left: "0",
                  background: "#222",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid gray"
                }}>
                  <button
                    onClick={() => handleDeleteGame(game.id, game.name)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      cursor: "pointer",
                      borderRadius: "5px",
                      border: "none",
                      background: "#d9534f",
                      color: "white"
                    }}
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Açıklamalar;
