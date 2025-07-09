const Header = () => {
  return (
    <header className="bg-green-100 py-4 px-8 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Font Visualization Tool</h1>
        <nav className="space-x-4">
          <a href="#" className="text-green-700 hover:underline">Home</a>
          <a href="#" className="text-green-700 hover:underline">How to Use</a>
          <a href="#" className="text-green-700 hover:underline">GitHub</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
