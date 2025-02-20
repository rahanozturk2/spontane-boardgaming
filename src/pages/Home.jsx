import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const [games, setGames] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  useEffect(() => {
    const fetchGamesWithRatings = async () => {
      const ratingsSnapshot = await getDocs(collection(db, "ratings"));
      const ratingsData = {};

      ratingsSnapshot.docs.forEach((doc) => {
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
    };

    fetchGamesWithRatings();
  }, []);

  // Sıralama fonksiyonu
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
        <table border="1">
          <thead>
            <tr>
              <th>Oyun Adı</th>
              {["EğlenceKeyif", "StratejiDüşünme", "Basitlik", "TekrarOynanabilirlik", "RekabetDengesi", "GörsellikTema", "SosyalEtkileşim", "GenelPuan"].map((key) => (
                <th key={key} onClick={() => handleSort(key)} style={{ cursor: "pointer" }}>
                  {key.replace(/([A-Z])/g, " $1")} {sortConfig.key === key ? (sortConfig.direction === "desc" ? "🔽" : "🔼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={index}>
                <td>{game.name}</td>
                <td>{game.EğlenceKeyif}</td>
                <td>{game.StratejiDüşünme}</td>
                <td>{game.Basitlik}</td>
                <td>{game.TekrarOynanabilirlik}</td>
                <td>{game.RekabetDengesi}</td>
                <td>{game.GörsellikTema}</td>
                <td>{game.SosyalEtkileşim}</td>
                <td>{game.GenelPuan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz bir oyun puanlanmadı.</p>
      )}
    </div>
  );
}

export default Home;
