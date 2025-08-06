import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import VehicleSidebar from '../Components/Layout/VehicleSidebar';
import TopNav from '../Components/Layout/TopNav';
import { addVehicleRecord } from '../APIS/APIS';
import ProcessingIndicator from '../Components/units/processingIndicator';

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: '',
    make: '',
    model: '',
    vehicleRegNum: '',
    chassisNum: '',
    maintenanceHist: [{ hist: '', date: '' }],
    driverName: '',
    contactDetails: {
      phone: '',
      location: '',
    },
    licenseNum: '',
    licenseType: '',
    licenseNumExp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('contactDetails.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMaintenanceChange = (index, field, value) => {
    const updatedHist = [...formData.maintenanceHist];
    updatedHist[index][field] = value;
    setFormData((prev) => ({ ...prev, maintenanceHist: updatedHist }));
  };

  const addMaintenanceField = () => {
    setFormData((prev) => ({
      ...prev,
      maintenanceHist: [...prev.maintenanceHist, { hist: '', date: '' }],
    }));
  };

  const removeMaintenanceField = (index) => {
    if (formData.maintenanceHist.length > 1) {
      const updatedHist = formData.maintenanceHist.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, maintenanceHist: updatedHist }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addVehicleRecord(formData);
      if (response.status === 200) {
        toast.success('Vehicle record added successfully');
        navigate('/vehicles/list');
      } else {
        toast.error(response.message || 'An error occurred.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Unexpected error occurred';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <ToastContainer position="top-center" autoClose={3000} />
      <VehicleSidebar
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex flex-col w-full">
        <TopNav
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
          className="sticky top-0 z-30 bg-white shadow-md"
        />

        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Add New Vehicle Record</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicle Type */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="commercial car">Commercial Car</option>
                  <option value="luxury car">Luxury Car</option>
                  <option value="taxi">Taxi</option>
                  <option value="truck">Truck</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Details */}
                <div className="w-full space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                    <input
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                    <input
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                    <input
                      name="vehicleRegNum"
                      value={formData.vehicleRegNum}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number *</label>
                    <input
                      name="chassisNum"
                      value={formData.chassisNum}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Driver Details */}
                <div className="w-full space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
                    <input
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      name="contactDetails.phone"
                      value={formData.contactDetails.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      name="contactDetails.location"
                      value={formData.contactDetails.location}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div className="w-full pt-2">
                <h2 className="text-lg font-medium mb-3">License Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                    <input
                      name="licenseNum"
                      value={formData.licenseNum}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Type *</label>
                    <select
                      name="licenseType"
                      value={formData.licenseType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="commercial">Commercial</option>
                      <option value="non-commercial">Non-Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date *</label>
                    <input
                      type="date"
                      name="licenseNumExp"
                      value={formData.licenseNumExp}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div className="w-full pt-2">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">Maintenance History</h2>
                  <button
                    type="button"
                    onClick={addMaintenanceField}
                    className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition duration-300"
                  >
                    + Add Record
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.maintenanceHist.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border border-gray-200 rounded bg-gray-50">
                      <div className="flex-grow">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Maintenance Detail</label>
                        <input
                          type="text"
                          placeholder="e.g., Oil Change"
                          value={item.hist}
                          onChange={(e) => handleMaintenanceChange(index, 'hist', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="sm:w-40">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => handleMaintenanceChange(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {formData.maintenanceHist.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMaintenanceField(index)}
                          className="mt-2 sm:mt-6 text-red-500 hover:text-red-700 text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium
                    ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loading ? <ProcessingIndicator message="Adding Record..." /> : 'Save Vehicle Record'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}