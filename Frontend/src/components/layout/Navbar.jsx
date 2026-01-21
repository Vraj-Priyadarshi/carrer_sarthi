import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  TrendingUp, 
  Route, 
  BookOpen, 
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  X,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar Component
 * Main navigation for the Career Intelligence Dashboard
 * Features: Responsive design, active states, user menu, sector badge
 */
export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, currentSector } = useAuth();
  const location = useLocation();

  // Navigation items configuration
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & Quick Stats'
    },
    { 
      path: '/skills', 
      label: 'Skill Progression', 
      icon: TrendingUp,
      description: 'Radar Chart & Gap Analysis'
    },
    { 
      path: '/pathway', 
      label: 'Career Pathway', 
      icon: Route,
      description: 'AI Journey Timeline'
    },
    { 
      path: '/learning', 
      label: 'Learning & Projects', 
      icon: BookOpen,
      description: 'Courses & Projects'
    },
    { 
      path: '/ai-insights', 
      label: '🧠 AI Insights', 
      icon: Brain,
      description: 'Market Intelligence'
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User,
      description: 'Your Career Profile'
    },
  ];

  // Get sector-specific styling
  const getSectorStyles = () => {
    switch (currentSector) {
      case 'Healthcare':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          accent: 'text-blue-400',
          glow: 'shadow-blue-500/20'
        };
      case 'Agriculture':
        return {
          badge: 'bg-green-500/20 text-green-300 border-green-500/30',
          accent: 'text-green-400',
          glow: 'shadow-green-500/20'
        };
      case 'Urban':
        return {
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          accent: 'text-indigo-400',
          glow: 'shadow-indigo-500/20'
        };
      default:
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          accent: 'text-blue-400',
          glow: 'shadow-blue-500/20'
        };
    }
  };

  const sectorStyles = getSectorStyles();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 ${sectorStyles.glow} shadow-lg`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white">Career Saarthi</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${sectorStyles.badge}`}>
                {currentSector}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                    isActive 
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? sectorStyles.accent : ''}`} />
                  {item.label}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full`}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.description}
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side: User Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 px-3 py-2 rounded-xl transition-all duration-200 border border-gray-700/50"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">{user?.firstName}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl py-2 overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </NavLink>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? sectorStyles.accent : ''}`} />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
