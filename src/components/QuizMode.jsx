import { useEffect, useState } from "react";

const QuizMode = ({ allFonts, onResult }) => {
  const [quizFonts, setQuizFonts] = useState([]);
  const [likedFonts, setLikedFonts] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [loadingFonts, setLoadingFonts] = useState(false);
  const totalQuestions = 5;

  const loadNextQuiz = () => {
    const shuffled = [...allFonts].sort(() => 0.5 - Math.random());
    const nextFonts = shuffled.slice(0, 3);
    setLoadingFonts(true);
    setQuizFonts(nextFonts);

    document.fonts.ready.then(() => {
      console.log(
        "フォント読み込み完了:",
        nextFonts.map((f) => f.family)
      );
      setLoadingFonts(false);
    });
  };

  // フォントリンクを動的に追加
  useEffect(() => {
    if (quizFonts.length === 0) return;

    quizFonts.forEach((font) => {
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
  }, [quizFonts]);

  useEffect(() => {
    if (allFonts.length >= 3) {
      loadNextQuiz();
    }
  }, [allFonts]);

  const handleChoice = (font) => {
    const newLikedFonts = [...likedFonts, font];
    setLikedFonts(newLikedFonts);
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    if (nextCount >= totalQuestions) {
      const result = recommendFonts(newLikedFonts);
      onResult(result);
    } else {
      loadNextQuiz();
    }
  };

  const recommendFonts = (liked) => {
    const avgX = liked.reduce((sum, f) => sum + f.x, 0) / liked.length;
    const avgY = liked.reduce((sum, f) => sum + f.y, 0) / liked.length;

    const shuffled = [...allFonts].sort(() => 0.5 - Math.random());
    const sorted = shuffled
      .map((f) => ({
        ...f,
        dist: Math.hypot(f.x - avgX, f.y - avgY),
      }))
      .sort((a, b) => a.dist - b.dist);

    return sorted.slice(0, 5);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>
        フォント診断 {questionCount + 1} / {totalQuestions}
      </h2>
      <p>直感で一番好きなフォントを選んでください。</p>

      {loadingFonts ? (
        <p>フォントを読み込み中...</p>
      ) : quizFonts.length === 3 ? (
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {quizFonts.map((font) => (
            <div
              key={font.family}
              onClick={() => handleChoice(font)}
              style={{
                cursor: "pointer",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                width: "30%",
                textAlign: "center",
                fontFamily: `'${font.family}', sans-serif`,
                fontSize: "1.5rem",
              }}
            >
              <p style={{ marginBottom: "0.5rem" }}>Sample Text</p>
              <div style={{ fontSize: "0.9rem", color: "#555" }}>
                {font.family}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default QuizMode;
