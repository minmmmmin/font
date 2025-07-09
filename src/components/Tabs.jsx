import { useState } from "react";
import ViewsGraph from "./graphs/ViewsGraph";
import TrendGraph from "./graphs/TrendGraph";
import OsShareGraph from "./graphs/OsShareGraph";
import BrowserShareGraph from "./graphs/BrowserShareGraph";

const tabList = [
  { id: "views", label: "Views" },
  { id: "os", label: "OS Share" },
  { id: "browser", label: "Browser Share" },
  { id: "trend", label: "Trend" },
];

const Tabs = ({ font }) => {
  const [activeTab, setActiveTab] = useState("views");

  const renderTabContent = () => {
    switch (activeTab) {
      case "views":
        return <ViewsGraph data={font} />;
      case "os":
        return <OsShareGraph data={font} />;
      case "browser":
        return <BrowserShareGraph data={font} />;
      case "trend":
        return <TrendGraph data={font} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex border-b mb-4">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderTabContent()}</div>
    </>
  );
};

export default Tabs;
