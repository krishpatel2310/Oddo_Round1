import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; 
import button from "daisyui/components/button";
import { LogOut } from "lucide-react";


const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

    const handleLogout = () => {
    localStorage.removeItem("user");  // clear storage
    setUser(null);                    // update state
    navigate("/login");               // redirect
  };

  return (
    <div className="navbar bg-white bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="btn  btn-ghost normal-case text-xl text-primary">
          ExpenseTracker
        </Link>
      </div>
      <div className="flex-none gap-2">
        {user ? (
         <>
         <p className="text-sm font-medium text-black" >Hi, {user.name}</p>
        
         <button 
              onClick={handleLogout} 
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
            </>
        ): (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
