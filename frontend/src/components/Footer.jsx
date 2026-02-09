function Footer() {
    return (
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 ECO PJ. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="/about" className="hover:text-gray-300">About</a>
            <a href="/contact" className="hover:text-gray-300">Contact</a>
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;