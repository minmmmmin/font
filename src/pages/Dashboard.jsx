import { useEffect, useState } from "react";
import { fetchFontAnalytics } from "../api/analytics";
import FontSelector from "../components/FontSelector";
import Tabs from "../components/Tabs";

const Dashboard = () => {
  const [fontData, setFontData] = useState([]);
  const [selectedFont, setSelectedFont] = useState(null);

  useEffect(() => {
    fetchFontAnalytics().then((data) => {
      setFontData(data);
      setSelectedFont(data[0]);
    });
  }, []);

  if (!selectedFont) return <div>Loading...</div>;

  return (
    <>
      <FontSelector
        fonts={fontData}
        selectedFont={selectedFont}
        onSelect={setSelectedFont}
      />
      <Tabs font={selectedFont} />
    </>
  );
};

export default Dashboard;
