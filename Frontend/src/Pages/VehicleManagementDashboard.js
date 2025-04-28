import React, { useEffect, useState } from 'react';
import VehicleSidebar from '../Components/Layout/VehicleSidebar';
import TopNav from '../Components/Layout/TopNav';
import {
  Car,
  Truck,
  BusFront,
  Users,
  Phone,
  MapPin,
  CalendarCheck2,
  BarChart3,
  BadgeCheck,
  Star,
  
} from 'lucide-react';
import { getVehicles } from '../APIS/APIS';

export default function VehicleDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getVehicles();
        if (response.status === 200) {
          setVehicles(response.data);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error(err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'commercial car': return <BadgeCheck className="text-blue-600" />;
      case 'luxury car': return <Star className="text-purple-600" />;
      case 'taxi': return <Car className="text-yellow-500" />;
      case 'truck': return <Truck className="text-orange-600" />;
      case 'bus': return <BusFront className="text-red-500" />;
      default: return <Car className="text-gray-400" />;
    }
  };

  const countByType = (type) => vehicles.filter(v => v.vehiceType === type).length;

  const types = [
    { label: 'Commercial Cars', value: 'commercial car', icon: <BadgeCheck className="text-blue-600" /> },
    { label: 'Luxury Cars', value: 'luxury car', icon: <Star className="text-purple-600" /> },
    { label: 'Taxis', value: 'taxi', icon: <Car className="text-yellow-500" /> },
    { label: 'Trucks', value: 'truck', icon: <Truck className="text-orange-600" /> },
    { label: 'Buses', value: 'bus', icon: <BusFront className="text-red-500" /> }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VehicleSidebar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
      <div className="flex-1">
        <TopNav toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
        <main className="p-6 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total Vehicles</div>
                <BarChart3 className="text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-700 mt-2">{vehicles.length}</div>
            </div>
            {types.map((t) => (
              <div key={t.value} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">{t.label}</div>
                  {t.icon}
                </div>
                <div className="text-2xl font-bold text-gray-700 mt-2">{countByType(t.value)}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 text-lg">No vehicles available.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.slice(0,6).map((vehicle) => (
                <div key={vehicle._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                      {getVehicleIcon(vehicle.vehiceType)}
                      <span className="capitalize">{vehicle.vehiceType}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{vehicle.vehicleRegNum}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1"><strong>Make:</strong> {vehicle.make}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Model:</strong> {vehicle.model}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Chassis:</strong> {vehicle.chassisNum}</p>
                  <p className="text-sm text-gray-700 mb-1 flex items-center gap-1"><Users size={14} /> <strong>Driver:</strong> {vehicle.driverName}</p>
                  <p className="text-sm text-gray-700 mb-1 flex items-center gap-1"><Phone size={14} /> {vehicle.contactDetails?.phone}</p>
                  <p className="text-sm text-gray-700 mb-1 flex items-center gap-1"><MapPin size={14} /> {vehicle.contactDetails?.location}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>License:</strong> {vehicle.licenseNum} ({vehicle.licenseType})</p>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <CalendarCheck2 size={14} /> Exp: {new Date(vehicle.licenseNumExp).toLocaleDateString()}
                  </p>
                  <div className="text-xs mt-2 text-gray-500 italic">
                    {vehicle.maintenanceHist?.length > 0 ? `${vehicle.maintenanceHist.length} maintenance record(s)` : 'No maintenance history'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
