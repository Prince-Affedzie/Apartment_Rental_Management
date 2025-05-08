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
  const [loading,setLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
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
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <ToastContainer />
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

        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Add New Vehicle Record</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Vehicle Type */}
              <div className="w-full col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="commercial car">Commercial Car</option>
                  <option value="luxury car">Luxury Car</option>
                  <option value="taxi">Taxi</option>
                  <option value="truck">Truck</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              {/* Common Inputs */}
              {[
                ['make', 'Make'],
                ['model', 'Model'],
                ['vehicleRegNum', 'Registration Number'],
                ['chassisNum', 'Chassis Number'],
                ['driverName', 'Driver Name'],
                ['contactDetails.phone', 'Phone Number'],
                ['contactDetails.location', 'Location'],
                ['licenseNum', 'License Number'],
              ].map(([key, label]) => (
                <div className="w-full col-span-1" key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    name={key}
                    value={
                      key.includes('.') ? formData.contactDetails[key.split('.')[1]] : formData[key]
                    }
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* License Type */}
              <div className="w-full col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="commercial">Commercial</option>
                  <option value="non-commercial">Non-Commercial</option>
                </select>
              </div>

              {/* License Expiry */}
              <div className="w-full col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                <input
                  type="date"
                  name="licenseNumExp"
                  value={formData.licenseNumExp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Maintenance History */}
              <div className="w-full col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance History</label>
                {formData.maintenanceHist.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Maintenance Detail"
                      value={item.hist}
                      onChange={(e) => handleMaintenanceChange(index, 'hist', e.target.value)}
                      className=" w-full flex-1 px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleMaintenanceChange(index, 'date', e.target.value)}
                      className="w-full sm:w-40 px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMaintenanceField}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  + Add Maintenance Record
                </button>
              </div>

              <div className="col-span-2">
                <button
                 disabled= {loading}
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 text-sm 
                    ${loading ? 'opacity-70 scale-95 cursor-wait transition-all duration-300' : 'transition-all duration-300'}`}
                >
                  {loading ? <ProcessingIndicator message="Adding Record..." /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
