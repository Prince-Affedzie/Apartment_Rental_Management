import { useState, useEffect } from 'react';
import MainLayout from '../Components/Layout/MainLayout';
import Sidebar from '../Components/Layout/Sidebar';
import TopNav from '../Components/Layout/TopNav';
import StatsOverview from '../Components/Dashboard/StatsOverview';
import { Home, Users, DollarSign } from 'lucide-react';
import PropertyList from '../Components/Dashboard/PropertyList';
import { getApartmentProperties } from '../APIS/APIS';

export default function ApartmentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await getApartmentProperties();
        if (response.status === 200) {
          setApartments(response.data);
        } else {
          setApartments([]);
        }
      } catch (err) {
        console.log(err);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  const totalUnits = apartments.length;
  const occupiedUnits = apartments.filter(a => a.status === 'Occupied').length;
  const vacantUnits = apartments.filter(a => a.status === 'Available').length;
  const monthlyRevenue = apartments
    .filter(a => a.status === 'Occupied')
    .reduce((sum, apt) => sum + (parseFloat(apt.price) || 0), 0);

  const stats = [
    { id: 1, title: 'Total Units', value: totalUnits, change: '', isPositive: true, icon: <Home size={22} />, iconBg: 'bg-blue-100 text-blue-600' },
    { id: 2, title: 'Occupied', value: occupiedUnits, change: '', isPositive: true, icon: <Users size={22} />, iconBg: 'bg-green-100 text-green-600' },
    { id: 3, title: 'Vacant', value: vacantUnits, change: '', isPositive: false, icon: <Home size={22} />, iconBg: 'bg-amber-100 text-amber-600' },
    { id: 4, title: 'Monthly Revenue', value: `GHC ${monthlyRevenue.toFixed(2)}`, change: '', isPositive: true, icon: <DollarSign size={22} />, iconBg: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <MainLayout
      sidebar={<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />}
      topNav={<TopNav toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />}
    >
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : apartments.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg">No apartment data available.</div>
      ) : (
        <>
          <StatsOverview stats={stats} />
          <PropertyList units={apartments} />
        </>
      )}
    </MainLayout>
  );
}
