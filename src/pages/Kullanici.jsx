import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where, onSnapshot } from "firebase/firestore";

function Kullanici() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [ratings, setRatings] = useState({
    EğlenceKeyif: 0,
    StratejiDüşünme: 0,
    Basitlik: 0,
    TekrarOynanabilirlik: 0,
    RekabetDengesi: 0,
    GörsellikTema: 0,
    SosyalEtkileşim: 0,
    GenelPuan: 0,
  });

  const [userRatings, setUserRatings] = useState([]); // 🔹 Kullanıcının puanlarını saklar

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserRatings(currentUser.email);
      }
    });

    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      setGames(querySnapshot.docs.map((doc) => doc.data().name));
    };

    fetchGames();
    return () => unsubscribe();
  }, []);

// Kullanıcının kendi verdiği puanları çek (sadece en güncel olanları)
const fetchUserRatings = (userEmail) => {
  const q = query(collection(db, "ratings"), where("user", "==", userEmail));
  onSnapshot(q, (snapshot) => {
    const userRatingsData = {};

    snapshot.docs.forEach((doc) => {
      const { game, ratings, timestamp } = doc.data();

      // 🔴 Aynı oyuna ait sadece en güncel puanı sakla
      if (!userRatingsData[game] || userRatingsData[game].timestamp < timestamp) {
        userRatingsData[game] = { id: doc.id, game, ratings, timestamp };
      }
    });

    // 🔹 Object.values() kullanarak sadece en güncel puanlamaları alıyoruz
    setUserRatings(Object.values(userRatingsData));
  });
};


  // Kullanıcının seçtiği puanı kaydetmesi
  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: Number(value),
    }));
  };

  // Firestore'a verileri kaydetme
  const handleSubmit = async () => {
    if (!selectedGame) {
      alert("Lütfen bir oyun seçin!");
      return;
    }

    try {
      await addDoc(collection(db, "ratings"), {
        user: user?.email || "Anonim",
        game: selectedGame,
        ratings,
        timestamp: new Date(),
      });
      alert("Puanlar başarıyla kaydedildi!");
    } catch (error) {
      console.error("Puan kaydedilemedi:", error);
      alert("Bir hata oluştu, tekrar deneyin!");
    }
  };

  return (
    <div className="page-content">
      <h2>Kullanıcı Puanlama</h2>

      {!user ? (
        <p>Lütfen giriş yapın.</p>
      ) : (
        <>
          {/* Oyun Seçme ve Puanlama Bölümü */}
          <label>Oyun Seç:</label>
          <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
            <option value="">Oyun Seçiniz</option>
            {games.map((game, index) => (
              <option key={index} value={game}>
                {game}
              </option>
            ))}
          </select>

          {selectedGame && (
            <>
              {Object.keys(ratings).map((category, index) => (
                <div key={index}>
                  <label>{category.replace(/([A-Z])/g, " $1")}: </label>
                  <select value={ratings[category]} onChange={(e) => handleRatingChange(category, e.target.value)}>
                    {[...Array(11).keys()].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button onClick={handleSubmit}>Puanları Kaydet</button>
            </>
          )}

          {/* 🔹 Kullanıcının Kendi Puanlarını Gösteren Tablo */}
          <h3>Senin Puanların</h3>
          {userRatings.length > 0 ? (
            <table border="1" style={{ width: "100%", marginTop: "20px", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Oyun Adı</th>
                  <th>Eğlence/Keyif</th>
                  <th>Strateji/Düşünme</th>
                  <th>Basitlik</th>
                  <th>Tekrar Oynanabilirlik</th>
                  <th>Rekabet Dengesi</th>
                  <th>Görsellik/Tema</th>
                  <th>Sosyal Etkileşim</th>
                  <th>Genel Puan</th>
                </tr>
              </thead>
              <tbody>
                {userRatings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.game}</td>
                    <td>{rating.ratings.EğlenceKeyif}</td>
                    <td>{rating.ratings.StratejiDüşünme}</td>
                    <td>{rating.ratings.Basitlik}</td>
                    <td>{rating.ratings.TekrarOynanabilirlik}</td>
                    <td>{rating.ratings.RekabetDengesi}</td>
                    <td>{rating.ratings.GörsellikTema}</td>
                    <td>{rating.ratings.SosyalEtkileşim}</td>
                    <td>{rating.ratings.GenelPuan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz herhangi bir oyun için puan vermedin.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Kullanici;
