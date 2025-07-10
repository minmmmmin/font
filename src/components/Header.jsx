import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-green-100 py-4 px-8 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">mojivisual</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-green-700 hover:underline">
            Home
          </Link>
          <Link to="/how-to-use" className="text-green-700 hover:underline">
            How to Use
          </Link>
          <a
            href="https://github.com/minmmmmin/font"
            className="text-green-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
