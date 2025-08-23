import { Bell, Menu, X, Search, ChevronDown, User, LayoutDashboard, CarFront, Users, FileText, DollarSign, Wrench, Home } from 'lucide-react';
import { useProfileContext } from '../../Context/fetchProfileContext';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function VehicleTopNav({ toggleMobileMenu, mobileMenuOpen }) {
  const { profile, getProfile } = useProfileContext();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('GHS');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!profile) {
      getProfile();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  // Navigation items matching the sidebar
  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/vehicles/dashboard" },
    { label: "Vehicles", icon: <CarFront size={16} />, path: "/vehicles/list" },
    { label: "Drivers", icon: <Users size={16} />, path: "/driver/list" },
    { label: "Contracts", icon: <FileText size={16} />, path: "/contracts/list" },
    { label: "Payments", icon: <DollarSign size={16} />, path: "/contract_payment/list" },
    { label: "Maintenance", icon: <Wrench size={16} />, path: "/vehicle/maintainance_list" },
    { label: "Apartments", icon: <Home size={16} />, path: "/apartments/dashboard" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Branding and Navigation */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button onClick={toggleMobileMenu} className="md:hidden mr-4">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Branding */}
            <h1 className="text-xl font-bold text-blue-600 mr-8">Vehicle Manager</h1>
            
            {/* Main Navigation Links */}
            <nav style={{
              display: windowWidth >= 1024 ? 'flex' : 'none',
            }} className="space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${isActive(item.path) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side controls 
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles, drivers..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative hidden md:block">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="GHS">GHS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {profile?.name ? (
                  <div className="h-8 w-8 bg-blue-600 text-white font-medium rounded-full flex items-center justify-center">
                    {profile.name.slice(0, 2).toUpperCase()}
                  </div>
                ) : (
                  <User className="h-8 w-8 rounded-full bg-gray-200 p-1 text-gray-600" />
                )}
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-sm font-medium text-gray-800">{profile?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{profile?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>*/}
        </div>

        {/* Mobile Navigation Links - Horizontal scroll */}
        <div className="md:hidden flex overflow-x-auto pt-3 space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-md flex items-center whitespace-nowrap ${
                isActive(item.path) 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}