import React from "react";
import {
  Car,
  ListChecks,
  ClipboardList,
  Home, 
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../APIS/APIS";

export default function VehicleSidebar({ toggleMobileMenu, mobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: <Car size={18} />, path: "/vehicles/dashboard" },
    { label: "Vehicles", icon: <ListChecks size={18} />, path: "/vehicles/list" },
    { label: "Maintenance", icon: <ClipboardList size={18} />, path: "/vehicle/maintainance_list" },
    { label: "Go To Appartment Dashboard", icon: <Home size={18} />, path: "/apartments/dashboard" },
   // { label: "Drivers", icon: <User size={18} />, path: "/vehicles/drivers" },
  ];

  const settingsItems = [
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  const handleLogout = async()=>{
      try{
        const response = await logout()
        if(response.status ===200){
          navigate('/')
        }
  
      }catch(err){
        console.log(err)
      }
    }

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button className="bg-white p-2 rounded-full shadow-md" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-25 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">🚗 Vehicle Manager</h2>
          <Section title="Main" items={navItems} currentPath={location.pathname} navigate={navigate} />
          <Section title="Settings" items={settingsItems} currentPath={location.pathname} navigate={navigate} />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={()=>handleLogout()} className="flex items-center gap-2 w-full text-red-600 hover:bg-red-50 px-4 py-2 rounded-md">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function Section({ title, items, currentPath, navigate }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </div>
      <ul>
        {items.map(({ label, icon, path }) => (
          <li
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer mb-1 transition-all
              ${
                currentPath === path
                  ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                  : "hover:bg-gray-100"
              }`}
          >
            {icon}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
