import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/Sidebar';
import TopNav from '../Components/Layout/TopNav';
import { getApartmentProperties, deleteApartment } from '../APIS/APIS';
import { toast } from 'react-toastify';
import exportToExcel from '../Utils/exportToExcel';

export default function ApartmentsListPage() {

  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Renting Price' },
    { key: 'location', label: 'Location' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Apartment Status' },
    
    
  ];
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

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

  const deleteApart = async (Id) => {
    const confirmed = window.confirm("Are you sure you want to delete this apartment?");
    if (!confirmed) return;
    try {
      const response = await deleteApartment(Id);
      if (response.status === 200) {
        toast.success('Apartment Deleted Successfully');
        setApartments(prev => prev.filter(apt => apt._id !== Id));
      } else {
        toast.error(response.error || 'An Error Occurred. Please try again.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Unexpected error.';
      toast.error(message);
    }
  };

  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-30 bg-white shadow-md">
          <TopNav toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
        </div>
        <div className="flex-1 p-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Apartments List</h1>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <button
                onClick={() => navigate('/apartments/add_property')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                + Add Property
              </button>

              <button
                onClick={() => exportToExcel(apartments, 'Apartments_List',fields)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
               >
                Export Apartments
               </button>

            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 text-lg">No apartments found.</div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((apt) => (
                  <div key={apt._id || apt.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-base font-semibold text-gray-800 truncate w-2/3">{apt.title}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        apt.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : apt.status === 'Occupied'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{apt.location}</p>
                    <p className="text-sm font-medium text-blue-600 mb-3">GHC {apt.price}</p>
                    <div className="flex justify-between items-center text-sm">
                      <button className="text-blue-500 hover:underline">Details</button>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/apartment/edit/${apt._id}`)} className="text-yellow-500 hover:text-yellow-600">Edit</button>
                        <button onClick={() => deleteApart(apt._id)} className="text-red-500 hover:text-red-600">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'} hover:bg-blue-100`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
