import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // 🔴 Hata buradaysa bu satırı kontrol et!
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

function Açıklamalar() {
  const [gameName, setGameName] = useState(""); // Yeni oyun adı
  const [games, setGames] = useState([]); // Firebase'deki oyun listesi
  const [selectedGame, setSelectedGame] = useState(null); // Seçili oyun menüsü

  // 📌 Firestore'dan oyunları çek
  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      const gamesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(gamesList);
    };

    fetchGames();
  }, []);

  // 📌 Yeni oyun ekleme fonksiyonu
  const handleAddGame = async () => {
    if (gameName.trim() === "") return; // Boş giriş engelleniyor
    await addDoc(collection(db, "games"), { name: gameName });
    setGameName(""); // Input'u temizle
    window.location.reload(); // Sayfayı yenileyerek güncelleme yap
  };

  // 📌 Oyun silme fonksiyonu
  const handleDeleteGame = async (gameId) => {
    await deleteDoc(doc(db, "games", gameId));
    setGames(games.filter(game => game.id !== gameId)); // Listeyi güncelle
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
          <li key={game.id} style={{ fontSize: "18px", margin: "10px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span>{game.name}</span>

            {/* Menü Butonu */}
            <div style={{ position: "relative", marginLeft: "10px" }}>
              <button
                onClick={() => setSelectedGame(selectedGame === game.id ? null : game.id)}
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
                    onClick={() => handleDeleteGame(game.id)}
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
