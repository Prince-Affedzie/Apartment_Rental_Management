import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/Sidebar';
import TopNav from '../Components/Layout/TopNav';
import { fetchTenantRecord } from '../APIS/APIS';
import { editTenant } from '../APIS/APIS';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditTenantPage() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantPhone: '',
    roomDescription: '',
    rentedDate: '',
    expirationDate: '',
    noOfMonthsRented: '',
    amountPaidOnUtility: '',
    monthlyPrice: '',
    totalAmount: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const response = await fetchTenantRecord(Id);
        if (response.status === 200) {
          const fetchedData = response.data;
          setFormData({
            ...fetchedData,
            rentedDate: fetchedData.rentedDate?.substring(0, 10) || '',
            expirationDate: fetchedData.expirationDate?.substring(0, 10) || '',
          });
        } else {
          setError('Failed to load tenant data.');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong while fetching tenant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [Id]);

  useEffect(() => {
    const { monthlyPrice, noOfMonthsRented, amountPaidOnUtility } = formData;
    if (monthlyPrice && noOfMonthsRented && amountPaidOnUtility) {
      const total = parseInt(parseFloat(monthlyPrice) * parseFloat(noOfMonthsRented)) + parseFloat(amountPaidOnUtility);
      setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
    }
  }, [formData.monthlyPrice, formData.noOfMonthsRented, formData.amountPaidOnUtility]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await editTenant(Id, formData);
      if (response.status === 200) {
        toast.success('Tenant Record Modified Successfully');
        navigate('/apartments/tenants');
      } else {
        toast.error(response.error || "An error occurred. Please try again");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
  <ToastContainer />
  <Sidebar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
  
  <div className="flex-1 relative">
    {/* Top Navigation */}
    <TopNav
      toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      mobileMenuOpen={mobileMenuOpen}
      className="sticky top-0 z-30 bg-white shadow-md"
    />

    {/* Main Content */}
    <main className="p-6 mt-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Tenant</h1>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries({
              tenantName: 'Tenant Name',
              tenantPhone: 'Phone Number',
              roomDescription: 'Room Description',
              rentedDate: 'Rented Date',
              expirationDate: 'Expiration Date',
              noOfMonthsRented: 'No. of Months Rented',
              amountPaidOnUtility: 'Utility Amount',
              monthlyPrice: 'Monthly Price',
              totalAmount: 'Total Amount Paid',
            }).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  name={key}
                  type={key.includes('Date') ? 'date' : 'text'}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  value={formData[key] || ''}
                  onChange={handleChange}
                  required
                  readOnly={key === 'totalAmount'}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2 mt-4">
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Update Tenant
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
