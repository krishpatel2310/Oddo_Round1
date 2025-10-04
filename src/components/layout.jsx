import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ user, setUser }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!user) return <Outlet />;

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      <Sidebar isHovered={isHovered} setIsHovered={setIsHovered} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isHovered ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar user={user} setUser={setUser} />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
