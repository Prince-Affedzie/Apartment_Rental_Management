import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/Sidebar';
import TopNav from '../Components/Layout/TopNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addApartmentProperty } from '../APIS/APIS';
import ProcessingIndicator from '../Components/units/processingIndicator';

export default function AddPropertyPage() {
  const [loading,setLoading] = useState()
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    status: 'Available',
    description: '',
  });

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await addApartmentProperty(formData);
      if (response.status === 200) {
        toast.success('Apartment Added Successfully');
        navigate('/apartments/list');
      } else {
        toast.error(response.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer />
      {/* Sidebar */}
      <Sidebar toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <TopNav toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  name="location"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHC)</label>
                <input
                  name="price"
                  type="number"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the property in a few words..."
                ></textarea>
              </div>
              <div className="sm:col-span-2 mt-4">
                <button
                 type="submit" className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition 
                  ${loading ? 'opacity-70 scale-95 cursor-wait transition-all duration-300' : 'transition-all duration-300'}`}
                 disabled={loading}
                 >
                   {loading ? <ProcessingIndicator message="Adding your Property..." /> : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
