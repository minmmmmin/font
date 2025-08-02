import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HowToUse from "./pages/HowToUse";
import Quiz from "./pages/Quiz";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
