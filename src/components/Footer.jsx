const Footer = () => {
  return (
    <footer className="bg-green-100 py-6 mt-12 shadow-inner">
      <div className="max-w-4xl mx-auto text-center text-green-700 text-sm">
        <p>&copy; 2025 mojivisual. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          {/* <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a> */}
          <a
            href="https://x.com/carrot__pyon_"
            className="text-green-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
