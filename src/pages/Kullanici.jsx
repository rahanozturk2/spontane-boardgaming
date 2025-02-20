import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

function Kullanici() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]); // Oyun listesini sakla
  const [selectedGame, setSelectedGame] = useState(""); // Seçilen oyun
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

  useEffect(() => {
    // Kullanıcı giriş durumunu takip et
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Firestore'dan oyunları çek
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      setGames(querySnapshot.docs.map(doc => doc.data().name));
    };

    fetchGames();
    return () => unsubscribe();
  }, []);

  // Kullanıcının seçtiği puanı kaydetmesi
  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: Number(value),
    }));
  };

  // Firestore'a verileri kaydetme (Tekrar puan verirken önceki silinir)
  const handleSubmit = async () => {
    if (!selectedGame) {
      alert("Lütfen bir oyun seçin!");
      return;
    }
    if (!user) {
      alert("Puan kaydetmek için giriş yapmalısınız!");
      return;
    }

    try {
      // Kullanıcı ve oyun bazlı tekil bir belge oluştur (Eski veriyi silip yeni veriyi ekler)
      const ratingRef = doc(db, "ratings", `${user.uid}_${selectedGame}`);

      await setDoc(ratingRef, {
        user: user.email,
        game: selectedGame,
        ratings,
        timestamp: new Date(),
      });

      alert("Puan başarıyla güncellendi!");
    } catch (error) {
      console.error("Puan kaydedilemedi:", error);
      alert("Bir hata oluştu, tekrar deneyin!");
    }
  };

  return (
    <div className="page-content">
      <h2>Kullanıcı Puanlama</h2>

      {/* Kullanıcı giriş yapmamışsa uyarı */}
      {!user ? (
        <p>Lütfen giriş yapın.</p>
      ) : (
        <>
          {/* Dropdown - Oyun Seçimi */}
          <label>Oyun Seç:</label>
          <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
            <option value="">Oyun Seçiniz</option>
            {games.map((game, index) => (
              <option key={index} value={game}>{game}</option>
            ))}
          </select>

          {/* Puanlama Alanları */}
          {selectedGame && (
            <>
              {Object.keys(ratings).map((category, index) => (
                <div key={index}>
                  <label>{category.replace(/([A-Z])/g, " $1")}: </label>
                  <select
                    value={ratings[category]}
                    onChange={(e) => handleRatingChange(category, e.target.value)}
                  >
                    {[...Array(11).keys()].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              ))}

              <button onClick={handleSubmit}>Puanları Kaydet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Kullanici;
