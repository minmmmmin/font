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
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Views</h2>
        <ViewsGraph data={font} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">OS Share</h2>
        <OsShareGraph data={font} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Browser Share</h2>
        <BrowserShareGraph data={font} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Trend</h2>
        <TrendGraph data={font} />
      </section>
    </div>
  );
};

export default Tabs;
