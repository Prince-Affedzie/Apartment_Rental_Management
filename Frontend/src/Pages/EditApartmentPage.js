import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/Sidebar';
import TopNav from '../Components/Layout/TopNav';
import { getSingleApartment, updateApartment } from '../APIS/APIS';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProcessingIndicator from '../Components/units/processingIndicator';
export default function EditApartmentPage() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    status: 'Available',
  });

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const response = await getSingleApartment(Id);
        if (response.status === 200) {
          setFormData(response.data);
        } else {
          toast.error('Failed to fetch apartment data.');
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await updateApartment(Id, formData);
      if (response.status === 200) {
        toast.success('Apartment updated successfully');
        navigate('/apartments/list');
      } else {
        toast.error(response.data?.error || 'Update failed.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Unexpected error.';
      toast.error(message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <ToastContainer />
      <Sidebar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />

      <div className="flex flex-col flex-1">
        <TopNav toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} className="sticky top-0 z-30 bg-white shadow-md" />

        <main className="p-6 mt-4">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Apartment</h1>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHC)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="sm:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled = {loading}
                    className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 text-sm 
                      ${loading ? 'opacity-70 scale-95 cursor-wait transition-all duration-300' : 'transition-all duration-300'}`}
                  >
                     {loading ? <ProcessingIndicator message="Saving Changes..." /> : 'Save Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
