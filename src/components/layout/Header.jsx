import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "OUR USHERS", href: "/ushers" },
    { name: "PREVIOUS EVENTS", href: "/events" },
    { name: "REQUEST USHERS", href: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 glass-effect border-b border-gray-800/30">
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/assets/logo1.png" className="h-12" alt="" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link text-sm tracking-wide ${
                  isActive(item.href) ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-300 font-light tracking-wide">
                  WELCOME, {user?.name?.toUpperCase()}
                </span>
                {isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="tracking-wide"
                    >
                      ADMIN DASHBOARD
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="tracking-wide"
                >
                  LOGOUT
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className="tracking-wide">
                    LOGIN
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button
                    size="sm"
                    className="tracking-wide bg-secondary-white text-primary-black hover:bg-secondary-off-white"
                  >
                    JOIN AS USHER
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-3"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 text-secondary-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-secondary-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2 bg-primary-black/95 backdrop-blur-md border border-gray-800 mt-4 shadow-strong">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 text-base font-light tracking-wide transition-colors ${
                    isActive(item.href)
                      ? "text-secondary-white bg-primary-rich-black"
                      : "text-gray-300 hover:text-secondary-white hover:bg-primary-rich-black/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-700 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 text-sm text-gray-300 font-light tracking-wide">
                      WELCOME, {user?.name?.toUpperCase()}
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <div className="block px-4 py-3 text-secondary-white hover:bg-primary-rich-black/50 transition-colors tracking-wide">
                          ADMIN DASHBOARD
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-300 hover:text-secondary-white hover:bg-primary-rich-black/50 transition-colors tracking-wide"
                    >
                      LOGOUT
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                      <div className="block px-4 py-3 text-gray-300 hover:text-secondary-white hover:bg-primary-rich-black/50 transition-colors tracking-wide">
                        LOGIN
                      </div>
                    </Link>
                    <Link to="/auth/signup" onClick={() => setIsOpen(false)}>
                      <div className="block px-4 py-3 text-secondary-white hover:bg-primary-rich-black/50 transition-colors tracking-wide">
                        JOIN AS USHER
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;
