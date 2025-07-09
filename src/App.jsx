import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 max-w-6xl mx-auto">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default App;
