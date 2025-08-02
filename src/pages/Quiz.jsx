import { useEffect, useState } from "react";
import QuizMode from "../components/QuizMode";
import { fetchFontAnalytics } from "../api/analytics";

const Quiz = () => {
  const [fonts, setFonts] = useState([]);
  const [recommended, setRecommended] = useState(null);

  useEffect(() => {
    console.log("useEffect called in Quiz.jsx");

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
      console.log("Font Analytics Loaded:", fontData);
      console.log("CSV text length:", csvText.length);

      const lines = csvText.trim().split("\n").slice(1);
      const umap = lines.map((line) => {
        const [rawFamily, x, y] = line.split(",");

        // 余計な空白や引用符を除去（"Roboto 100" → "Roboto"）
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

      console.log("Sample font from API:", fontData[0]?.family);
      console.log("Sample font from CSV:", umap[0]?.family);
      console.log(
        "🔍 Normalize match check:",
        normalize(fontData[0]?.family),
        "vs",
        normalize(umap[0]?.family)
      );

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
        <QuizMode allFonts={fonts} onResult={setRecommended} />
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
          <button
            onClick={() => setRecommended(null)}
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
