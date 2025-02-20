import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/Home.css"; // 🔴 CSS dosyasını unutma!

function Home() {
  const [games, setGames] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ratings"), (snapshot) => {
      const ratingsData = {};
      const userLastRatings = {}; // 🔴 Kullanıcıların en son oyları burada tutulur

      snapshot.docs.forEach((doc) => {
        const { game, ratings, user, timestamp } = doc.data();

        // 🔴 Aynı kullanıcı aynı oyuna birden fazla puan girdiyse, sadece en yenisini tut
        if (!userLastRatings[game]) {
          userLastRatings[game] = {};
        }

        if (!userLastRatings[game][user] || userLastRatings[game][user].timestamp < timestamp) {
          userLastRatings[game][user] = { ratings, timestamp };
        }
      });

      // 🔴 Kullanıcıların en son puanları baz alınarak ortalama hesaplanır
      Object.entries(userLastRatings).forEach(([game, users]) => {
        let totalRatings = {};
        let count = 0;

        Object.values(users).forEach(({ ratings }) => {
          count++; // 🔴 Her kullanıcının sadece en son oyunu sayılır
          Object.keys(ratings).forEach((key) => {
            if (!totalRatings[key]) {
              totalRatings[key] = 0;
            }
            totalRatings[key] += ratings[key];
          });
        });

        const averagedRatings = Object.fromEntries(
          Object.entries(totalRatings).map(([key, value]) => [key, (value / count).toFixed(1)])
        );

        ratingsData[game] = { ...averagedRatings, count };
      });

      // 🔹 Güncellenmiş veriyi state'e atıyoruz
      setGames(
        Object.entries(ratingsData).map(([name, ratingData]) => ({
          name,
          ...ratingData,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // **Sıralama fonksiyonu**
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }

    const sortedGames = [...games].sort((a, b) => {
      if (direction === "asc") {
        return a[key] - b[key];
      } else {
        return b[key] - a[key];
      }
    });

    setGames(sortedGames);
    setSortConfig({ key, direction });
  };

  return (
    <div className="page-content">
      <h2>Oyun Puanları</h2>
      {games.length > 0 ? (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th className="sticky-column">Oyun Adı</th>
                {[
                  "EğlenceKeyif",
                  "StratejiDüşünme",
                  "Basitlik",
                  "TekrarOynanabilirlik",
                  "RekabetDengesi",
                  "GörsellikTema",
                  "SosyalEtkileşim",
                  "GenelPuan",
                ].map((key) => (
                  <th key={key} onClick={() => handleSort(key)}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={index}>
                  <td className="sticky-column">
                    {`${index + 1}. ${game.name} {${game.count || 0}}`} {/* 🔴 KAÇ KİŞİ OYLADI */}
                  </td>
                  <td>{game.EğlenceKeyif || "-"}</td>
                  <td>{game.StratejiDüşünme || "-"}</td>
                  <td>{game.Basitlik || "-"}</td>
                  <td>{game.TekrarOynanabilirlik || "-"}</td>
                  <td>{game.RekabetDengesi || "-"}</td>
                  <td>{game.GörsellikTema || "-"}</td>
                  <td>{game.SosyalEtkileşim || "-"}</td>
                  <td>{game.GenelPuan || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Henüz bir oyun puanlanmadı.</p>
      )}
    </div>
  );
}

export default Home;
