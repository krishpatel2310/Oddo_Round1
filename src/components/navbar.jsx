import { Bell, Calendar, Clock, Sun, Moon, LogOut, LogIn, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
      {/* Left side: greeting */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Good morning, {user?.name || "User"}!
        </h1>
        <p className="text-sm text-gray-500">
          Here's your financial overview
        </p>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-4">
        {/* Add Transaction Button */}
       <Link to="/add-transaction">
        <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm transition">
          + Add Transaction
        </button>
        </Link>

        {/* Icons */}
        <Link to="/reminders">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 block w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        </Link>

        {/* User Menu / Login-Logout */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.name || user?.email || "User"}
              </span>
            </button>
            
            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition">
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
