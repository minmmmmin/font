import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-green-100 py-6 px-8 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-green-800 text-center md:text-left">
          mojivisual
        </h1>
        <nav className="flex justify-center md:justify-end gap-6 text-green-700 text-lg">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/quiz" className="hover:underline">
            診断
          </Link>
          <a
            href="https://github.com/minmmmmin/font"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
