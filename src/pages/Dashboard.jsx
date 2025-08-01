import { useEffect, useState } from "react";
import { fetchFontAnalytics } from "../api/analytics";
import FontSelector from "../components/FontSelector";
import Tabs from "../components/Tabs";
import FontPreview from "../components/FontPreview";
import FontMap from "../components/graphs/FontMap";

const Dashboard = () => {
  const [fontData, setFontData] = useState([]);
  const [selectedFont, setSelectedFont] = useState(null);
  const [previewText, setPreviewText] = useState("サンプルテキスト");

  useEffect(() => {
    fetchFontAnalytics().then((data) => {
      setFontData(data);
      setSelectedFont(data[0]);
    });
  }, []);

  if (!selectedFont) return <div>Loading...</div>;

  return (
    <>
      <div className="flex space-x-4 max-w-4xl mx-auto p-4">
        <div className="flex-1">
          <FontSelector
            fonts={fontData}
            selectedFont={selectedFont}
            onSelect={setSelectedFont}
          />
        </div>
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="プレビュー用テキストを入力"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
        />
      </div>

      <FontPreview fontFamily={selectedFont.family} previewText={previewText} />


      <Tabs font={selectedFont} />
    </>
  );
};

export default Dashboard;
