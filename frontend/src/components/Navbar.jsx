import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-indigo-600">MyBrand</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#home" className="text-gray-700 hover:text-indigo-600">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600">
              About
            </a>
            <a href="#services" className="text-gray-700 hover:text-indigo-600">
              Services
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </a>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? (
                <XIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <a
            href="#home"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Home
          </a>
          <a
            href="#about"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            About
          </a>
          <a
            href="#services"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Services
          </a>
          <a
            href="#contact"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Contact
          </a>
          <button className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-2">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
