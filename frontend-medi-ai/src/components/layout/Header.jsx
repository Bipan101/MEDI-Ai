import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, Globe, Wifi, WifiOff, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button, Badge } from '../../components/ui';
// import { APP_NAME } from '../../utils/constants';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const toggleOfflineMode = () => {
    setIsOffline(!isOffline);
    // In a real app, this would handle offline functionality
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Mobile menu button and search */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions and profile */}
        <div className="flex items-center space-x-4">
          {/* Offline mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOfflineMode}
            className={`${isOffline ? 'text-orange-600' : 'text-gray-600'}`}
            title={isOffline ? 'Go online' : 'Go offline'}
          >
            {isOffline ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
          </Button>

          {/* Language selector */}
          <Button
            variant="ghost"
            size="sm"
            title="Language"
          >
            <Globe className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Badge 
              variant="error" 
              size="sm"
              className="absolute -top-1 -right-1 min-w-0 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 pl-2"
            >
              <img
                src={user?.avatar || `https://placehold.co/32x32/4ecdc4/ffffff?text=${user?.name?.charAt(0) || 'U'}`}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </Button>

            {/* Profile dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-gray-500">{user?.email}</div>
                  <Badge variant="outline" size="sm" className="mt-1">
                    {user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                  </Badge>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                
                <hr className="border-gray-100" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
