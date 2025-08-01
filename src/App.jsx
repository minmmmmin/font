import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HowToUse from "./pages/HowToUse";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Router>
      <header style={{ background: "#ccfcdc", padding: "1rem" }}>
        <h1 style={{ display: "inline-block", marginRight: "2rem" }}>mojivisual</h1>
        <nav style={{ display: "inline-block" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/how-to-use" style={{ marginRight: "1rem" }}>How to Use</Link>
          <Link to="/quiz">診断</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
