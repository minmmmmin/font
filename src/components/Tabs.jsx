import React, { useState } from "react";
import ViewsGraph from "./graphs/ViewsGraph";
import TrendGraph from "./graphs/TrendGraph";
import OsShareGraph from "./graphs/OsShareGraph";
import BrowserShareGraph from "./graphs/BrowserShareGraph";
import FontPreview from "./FontPreview";

const Tabs = ({ font }) => {
  const [previewText, setPreviewText] = useState("サンプルテキスト");

  if (!font) return null;

  return (
    <>
      <input
        type="text"
        className="w-full max-w-md p-2 mb-4 border rounded"
        placeholder="プレビュー用テキストを入力"
        value={previewText}
        onChange={(e) => setPreviewText(e.target.value)}
      />

      <FontPreview fontFamily={font.family} previewText={previewText} />

      <div className="grid grid-cols-2 grid-rows-2 gap-8 p-4">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Views</h2>
          <ViewsGraph key={font.name} data={font} />
        </section>
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">OS Share</h2>
          <OsShareGraph key={font.name} data={font} />
        </section>
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Browser Share</h2>
          <BrowserShareGraph key={font.name} data={font} />
        </section>
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Trend</h2>
          <TrendGraph key={font.name} data={font} />
        </section>
      </div>
    </>
  );
};

export default Tabs;
