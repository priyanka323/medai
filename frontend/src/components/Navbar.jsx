import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Calculator, Home, Info, Mail, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleAuth = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dose', icon: Heart, label: 'Medicine Dose' },
    { to: '/calculators', icon: Calculator, label: 'Calculators' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediDose
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={handleAuth}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {isLoggedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              <span>{isLoggedIn ? 'Sign Out' : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                handleAuth();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition mt-2"
            >
              {isLoggedIn ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              <span>{isLoggedIn ? 'Sign Out' : 'Sign In'}</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}