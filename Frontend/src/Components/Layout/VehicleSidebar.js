import React from "react";
import {
  Car,
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Home,
  Settings,
  LogOut,
  CarFront,
  DollarSign,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfileContext } from "../../Context/fetchProfileContext";

export default function VehicleSidebar({ toggleMobileMenu, mobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearProfile, profile } = useProfileContext();

  const userRole = profile?.role?.toLowerCase(); // ✅ normalize case

  // 🚀 Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      clearProfile();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // 🚀 General Buttons
  const handleHomeClick = () => {
    if (userRole === "admin") {
      navigate("/home");
    } else {
      navigate("/staff");
    }
  };

  // 🚗 Vehicle Items
  const vehicleNavItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/vehicles/dashboard",
    },
    { label: "Vehicles", icon: <CarFront size={18} />, path: "/vehicles/list" },
    { label: "Drivers", icon: <Users size={18} />, path: "/driver/list" },
    {
      label: "Contracts",
      icon: <FileText size={18} />,
      path: "/contracts/list",
    },
    {
      label: "Contract Payments",
      icon: <DollarSign size={18} />,
      path: "/contract_payment/list",
    },
    {
      label: "Maintenance",
      icon: <Wrench size={18} />,
      path: "/vehicle/maintainance_list",
    },
  ];

  const settingsItems = [
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:h-screen`}
    >
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Car className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Vehicle Manager</h2>
        </div>

        {/* 🌐 General Section */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-4">
            General
          </div>
          {/* Home */}
          <button
            onClick={handleHomeClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-left mb-1
              ${
                location.pathname === "/home" || location.pathname === "/staff"
                  ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Home size={18} />
            <span>{userRole === "admin" ? "Admin Home" : "Staff Home"}</span>
          </button>

          {/* Apartment Dashboard */}
          <button
            onClick={() => navigate("/apartments/dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-left
              ${
                location.pathname.startsWith("/apartments")
                  ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Home size={18} />
            <span>Apartment Dashboard</span>
          </button>
        </div>

        {/* 🚗 Vehicle Section */}
        <Section
          title="Main"
          items={vehicleNavItems}
          currentPath={location.pathname}
          navigate={navigate}
        />

        <Section
          title="Settings"
          items={settingsItems}
          currentPath={location.pathname}
          navigate={navigate}
        />
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function Section({ title, items, currentPath, navigate }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-4">
        {title}
      </div>
      <ul>
        {items.map(({ label, icon, path }) => (
          <li key={path} className="mb-1">
            <button
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-left
                ${
                  currentPath === path
                    ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
            >
              <span
                className={`${
                  currentPath === path ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {icon}
              </span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
