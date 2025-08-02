import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-green-100 py-4 px-8 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-green-800">
          mojivisual
        </h1>
        <nav className="space-x-4 text-green-700">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/how-to-use" className="hover:underline">
            How to Use
          </Link>
          <Link to="/quiz" className="hover:underline">
            診断
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
