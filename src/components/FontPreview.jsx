import WebFont from "webfontloader";
import { useEffect } from "react";

const FontPreview = ({ fontFamily, previewText }) => {
  useEffect(() => {
    if (!fontFamily) return;

    WebFont.load({
      google: {
        families: [fontFamily],
      },
    });
  }, [fontFamily]);

  return (
    <div
      style={{
        fontFamily,
        border: "1px solid #ccc",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      {previewText || "プレビューしたいテキストを入力してください"}
    </div>
  );
};

export default FontPreview;
