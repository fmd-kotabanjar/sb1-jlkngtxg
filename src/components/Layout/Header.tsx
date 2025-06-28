import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Zap
} from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => (
    <Link 
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        isActivePath(to)
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden xs:block">
              RacikanPrompt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {user?.role === 'admin' ? (
              // Admin Navigation
              <>
                <NavLink to="/">Admin Panel</NavLink>
                <NavLink to="/admin/prompts">Kelola Prompt</NavLink>
                <NavLink to="/admin/users">Kelola User</NavLink>
                <NavLink to="/admin/requests">Kelola Request</NavLink>
                <NavLink to="/admin/digital-products">Produk Digital</NavLink>
                <NavLink to="/explore">Jelajahi</NavLink>
              </>
            ) : (
              // Regular User Navigation
              <>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/explore">Jelajahi</NavLink>
                {user?.role === 'basic' && (
                  <NavLink to="/claimed">Diklaim</NavLink>
                )}
                <NavLink to="/redeem">Klaim Kode</NavLink>
                <NavLink to="/request">Request</NavLink>
                {user?.role !== 'premium' && user?.role !== 'admin' && (
                  <Link 
                    to="/upgrade"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm"
                  >
                    Upgrade
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-24">
                    {user?.name}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getRoleColor(user?.role || 'basic')}`}>
                    {user?.role?.toUpperCase()}
                  </div>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div 
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {/* Mobile user info */}
                    <div className="md:hidden px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getRoleColor(user?.role || 'basic')}`}>
                        {user?.role?.toUpperCase()}
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50">
              <nav className="px-4 py-4 space-y-2">
                {user?.role === 'admin' ? (
                  // Admin Mobile Navigation
                  <>
                    <Link 
                      to="/" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Admin Panel
                    </Link>
                    <Link 
                      to="/admin/prompts" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Kelola Prompt
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Kelola User
                    </Link>
                    <Link 
                      to="/admin/requests" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Kelola Request
                    </Link>
                    <Link 
                      to="/admin/digital-products" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Produk Digital
                    </Link>
                    <Link 
                      to="/explore" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Jelajahi
                    </Link>
                  </>
                ) : (
                  // Regular User Mobile Navigation
                  <>
                    <Link 
                      to="/" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/explore" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Jelajahi
                    </Link>
                    {user?.role === 'basic' && (
                      <Link 
                        to="/claimed" 
                        className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                        onClick={closeMobileMenu}
                      >
                        Prompt Diklaim
                      </Link>
                    )}
                    <Link 
                      to="/redeem" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Klaim Kode
                    </Link>
                    <Link 
                      to="/request" 
                      className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={closeMobileMenu}
                    >
                      Request Prompt
                    </Link>
                    {user?.role !== 'premium' && user?.role !== 'admin' && (
                      <Link 
                        to="/upgrade" 
                        className="block py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium text-center"
                        onClick={closeMobileMenu}
                      >
                        Upgrade Premium
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;