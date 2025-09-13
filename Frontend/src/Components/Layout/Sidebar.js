import {
  Home,
  Users,
  DollarSign,
  Settings,
  Car,
  LogOut,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfileContext } from "../../Context/fetchProfileContext";

export default function Sidebar({ toggleMobileMenu, mobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearProfile, profile } = useProfileContext();

  const userRole = profile?.role?.toLowerCase(); // ✅ normalize role

  const roleHomePath = (role) => {
    switch (role) {
      case "admin":
        return "/home"; // Admin landing (adjust if you prefer /apartments/dashboard)
      case "manager":
      case "staff":
        return "/staff";
      default:
        return "/staff";
    }
  };

  const handleHomeClick = () => {
    const target = roleHomePath(userRole);
    navigate(target);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      clearProfile();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home size={18} />,
      path: "/apartments/dashboard",
    },
    { label: "Properties", icon: <Home size={18} />, path: "/apartments/list" },
    {
      label: "Tenants",
      icon: <Users size={18} />,
      path: "/apartments/tenants",
    },
    {
      label: "Payments",
      icon: <DollarSign size={18} />,
      path: "/apartments/payment/list",
    },
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block flex flex-col`}
    >
      <div className="md:hidden flex justify-end p-4">
        <button onClick={toggleMobileMenu}>
          <X size={24} className="text-gray-700 hover:text-red-600" />
        </button>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Property Manager</h2>

        {/* 🧭 General Section */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            General
          </div>

          {/* Home Button */}
          {/* <button
            onClick={handleHomeClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-left mb-1
              ${
                location.pathname === "/" || location.pathname === "/staff"
                  ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <Home size={18} />
            <span>{userRole === "admin" ? "Admin Home" : "Staff Home"}</span>
          </button> */}

          <button
            onClick={handleHomeClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-left mb-1
    ${
      ["/home", "/staff"].includes(location.pathname)
        ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
        : "hover:bg-gray-100 text-gray-600"
    }`}
          >
            <Home size={18} />
            <span>{userRole === "admin" ? "Admin Home" : "Staff Home"}</span>
          </button>

          {/* Vehicle Dashboard Button */}
          <button
            onClick={() => navigate("/vehicles/dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-left
              ${
                location.pathname.startsWith("/vehicles")
                  ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <Car size={18} />
            <span>Vehicle Dashboard</span>
          </button>
        </div>

        {/* 🏢 Property Section */}
        <Section
          title="Main"
          items={navItems}
          currentPath={location.pathname}
          navigate={navigate}
        />
      </div>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-red-600 hover:bg-red-50 px-4 py-2 rounded-md"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
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
                  : "hover:bg-gray-100 text-gray-600"
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
