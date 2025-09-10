// In src/components/Navbar.jsx

import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, LogOut } from "lucide-react";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ FIX: Remove both the user AND the auth token
    localStorage.removeItem("user");
    localStorage.removeItem("authToken"); // This is the critical fix
    setUser(null);
    navigate("/login");
  };

  const activeLinkStyle = {
    color: 'white',
    textDecoration: 'underline',
    textUnderlineOffset: '4px'
  };

  return (
    <nav className="relative z-20 flex justify-between items-center px-8 py-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
      {/* Left Side: Brand */}
      <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-white">
        Expense<span className="text-slate-400">Tracker</span>
      </Link>

      {/* Right Side: Links and Actions */}
      <div className="flex items-center gap-6">
        {user ? (
          // --- Logged-In View ---
          <>
            <NavLink 
              to="/dashboard" 
              className="text-slate-400 hover:text-white transition-colors" 
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/transactions" 
              className="text-slate-400 hover:text-white transition-colors"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Transactions
            </NavLink>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white">
                   <CircleUser size={18} />
                   <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="cursor-pointer focus:bg-slate-700 focus:text-white">Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-slate-700 focus:text-white">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:bg-red-500/20 focus:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          // --- Logged-Out View ---
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-slate-700 text-white hover:bg-slate-600">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;