import { useEffect, useState } from "react";
import QuizMode from "../components/QuizMode";
import { fetchFontAnalytics } from "../api/analytics";

const Quiz = () => {
  const [fonts, setFonts] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [likedFonts, setLikedFonts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchFontAnalytics().catch((e) => {
        console.error("fetchFontAnalytics failed:", e);
        return [];
      }),
      fetch("/umap_font_data.csv")
        .then((res) => {
          if (!res.ok) throw new Error("CSV fetch failed");
          return res.text();
        })
        .catch((e) => {
          console.error("CSV fetch error:", e);
          return "";
        }),
    ]).then(([fontData, csvText]) => {
      const lines = csvText.trim().split("\n").slice(1);
      const umap = lines.map((line) => {
        const [rawFamily, x, y] = line.split(",");
        const cleanFamily = rawFamily.replace(/["']/g, "").split(" ")[0];
        return {
          family: cleanFamily,
          x: parseFloat(x),
          y: parseFloat(y),
        };
      });

      const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/gi, "");
      const merged = fontData
        .map((font) => {
          const coords = umap.find(
            (u) => normalize(u.family) === normalize(font.family)
          );
          return coords ? { ...font, x: coords.x, y: coords.y } : null;
        })
        .filter(Boolean);

      setFonts(merged);
    });
  }, []);

  useEffect(() => {
    if (!recommended) return;

    recommended.forEach((font) => {
      const linkId = `font-link-${font.family.replace(/\s+/g, "-")}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          font.family
        )}&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });
  }, [recommended]);

  return (
    <div>
      <h1 style={{ margin: "1rem" }}>フォント診断結果</h1>
      {!recommended ? (
        <QuizMode
          allFonts={fonts}
          onResult={setRecommended}
          setLikedFonts={setLikedFonts} // ← 追加
        />
      ) : (
        <div style={{ padding: "1rem" }}>
          <h2>あなたにおすすめのフォント</h2>
          {recommended.map((font) => (
            <div
              key={font.family}
              style={{
                fontFamily: font.family,
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              {font.family} — sample text
            </div>
          ))}

          {likedFonts.length > 0 && (
            <>
              <h3 style={{ marginTop: "2rem" }}>あなたが選んだフォント</h3>
              {likedFonts.map((font, idx) => (
                <div
                  key={`${font.family}-${idx}`}
                  style={{
                    fontFamily: font.family,
                    fontSize: "1.2rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {font.family}
                </div>
              ))}
            </>
          )}

          <button
            onClick={() => {
              setRecommended(null);
              setLikedFonts([]); // ← reset!
            }}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            もう一度診断する
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
