import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/Home.css"; // 🔴 CSS dosyasını eklemeyi unutma!

function Home() {
  const [games, setGames] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ratings"), (snapshot) => {
      const ratingsData = {};

      snapshot.docs.forEach((doc) => {
        const { game, ratings } = doc.data();
        if (!ratingsData[game]) {
          ratingsData[game] = { ...ratings, count: 1 };
        } else {
          Object.keys(ratings).forEach((key) => {
            ratingsData[game][key] += ratings[key];
          });
          ratingsData[game].count += 1;
        }
      });

      const formattedGames = Object.entries(ratingsData).map(([name, ratingData]) => {
        const averagedRatings = Object.fromEntries(
          Object.entries(ratingData).map(([key, value]) =>
            key === "count" ? [key, value] : [key, (value / ratingData.count).toFixed(1)]
          )
        );
        return { name, ...averagedRatings };
      });

      setGames(formattedGames);
    });

    return () => unsubscribe(); // Dinlemeyi durdur
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
                <th className="game-name">Oyun Adı</th>
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
                  <th key={key} className="score-column" onClick={() => handleSort(key)} style={{ cursor: "pointer" }}>
                    {key.replace(/([A-Z])/g, " $1")} {sortConfig.key === key ? (sortConfig.direction === "desc" ? "🔽" : "🔼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={index}>
                  <td className="game-name">{game.name}</td>
                  <td className="score-column">{game.EğlenceKeyif || "?"}</td>
                  <td className="score-column">{game.StratejiDüşünme || "?"}</td>
                  <td className="score-column">{game.Basitlik || "?"}</td>
                  <td className="score-column">{game.TekrarOynanabilirlik || "?"}</td>
                  <td className="score-column">{game.RekabetDengesi || "?"}</td>
                  <td className="score-column">{game.GörsellikTema || "?"}</td>
                  <td className="score-column">{game.SosyalEtkileşim || "?"}</td>
                  <td className="score-column">{game.GenelPuan || "?"}</td>
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
