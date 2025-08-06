import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VehicleSidebar from '../Components/Layout/VehicleSidebar';
import TopNav from '../Components/Layout/TopNav';
import { getSingleVehicle, updateVehicle } from '../APIS/APIS';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash2 } from 'lucide-react';

export default function EditVehiclePage() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    vehiceType: 'car',
    make: '',
    model: '',
    vehicleRegNum: '',
    chassisNum: '',
    driverName: '',
    contactDetails: {
      phone: '',
      location: ''
    },
    licenseNum: '',
    licenseType: 'commercial',
    licenseNumExp: '',
    maintenanceHist: []
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await getSingleVehicle(Id);
        if (response.status === 200) {
          const vehicle = response.data;
          vehicle.maintenanceHist = vehicle.maintenanceHist.map(m => ({
            hist: m.hist || '',
            date: m.date ? m.date.substring(0, 10) : ''
          }));
          setFormData(vehicle);
        } else {
          toast.error('Failed to load vehicle data');
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while fetching vehicle data');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'location') {
      setFormData((prev) => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          [name]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMaintenanceChange = (index, field, value) => {
    const updated = [...formData.maintenanceHist];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, maintenanceHist: updated }));
  };

  const addMaintenance = () => {
    setFormData((prev) => ({
      ...prev,
      maintenanceHist: [...prev.maintenanceHist, { hist: '', date: '' }]
    }));
  };

  const removeMaintenance = (index) => {
    const updated = formData.maintenanceHist.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, maintenanceHist: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateVehicle(Id, formData);
      if (response.status === 200) {
        toast.success('Vehicle updated successfully');
        navigate('/vehicles/list');
      } else {
        toast.error(response.data?.error || 'Update failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unexpected error';
      toast.error(msg);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer />
      <VehicleSidebar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
      <div className="flex-1">
        <TopNav toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
        <main className="p-6 mt-16">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Vehicle</h1>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label><select name="vehiceType" value={formData.vehiceType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value=''>select vehicle type</option>
                <option value="commercial car">Commercial Car</option>
                <option value="luxury car">Luxury Car</option>
                <option value="taxi">Taxi</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
                </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Make</label><input name="make" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.make} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Model</label><input name="model" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.model} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label><input name="vehicleRegNum" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.vehicleRegNum} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label><input name="chassisNum" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.chassisNum} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label><input name="driverName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.driverName} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input name="phone" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactDetails.phone} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input name="location" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactDetails.location} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">License Number</label><input name="licenseNum" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.licenseNum} onChange={handleChange} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">License Type</label><select name="licenseType" value={formData.licenseType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="commercial">Commercial</option><option value="non-commercial">Non-Commercial</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label><input type="date" name="licenseNumExp" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.licenseNumExp?.substring(0, 10)} onChange={handleChange} required /></div>

                <div className="sm:col-span-2 mt-4">
                  <h2 className="text-lg font-semibold mb-2">Maintenance History</h2>
                  {formData.maintenanceHist.map((entry, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Maintenance Description"
                        value={entry.hist || ''}
                        onChange={(e) => handleMaintenanceChange(idx, 'hist', e.target.value)}
                        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={entry.date || ''}
                        onChange={(e) => handleMaintenanceChange(idx, 'date', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="button" onClick={() => removeMaintenance(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addMaintenance} className="mt-2 text-sm text-blue-600 hover:underline">
                    + Add Maintenance Entry
                  </button>
                </div>

                <div className="sm:col-span-2 mt-4">
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Update Vehicle
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
