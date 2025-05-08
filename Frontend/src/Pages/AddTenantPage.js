import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/Sidebar';
import TopNav from '../Components/Layout/TopNav';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addTenantRecord } from '../APIS/APIS';
import ProcessingIndicator from '../Components/units/processingIndicator';

export default function AddTenantPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTotalAmountFocused, setIsTotalAmountFocused] = useState(false);
  const totalAmountInputRef = useRef(null);
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

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'totalAmount') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addTenantRecord(formData);
      if (response.status === 200) {
        toast.success('Tenant Record Added Successfully');
        navigate('/apartments/tenants');
      } else {
        toast.error(response.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isTotalAmountFocused && formData.noOfMonthsRented && formData.monthlyPrice && formData.amountPaidOnUtility) {
      const calculatedTotal = parseFloat(formData.noOfMonthsRented) * parseFloat(formData.monthlyPrice) + parseFloat(formData.amountPaidOnUtility);
      setFormData(prevFormData => ({
        ...prevFormData,
        totalAmount: isNaN(calculatedTotal) ? '' : calculatedTotal.toFixed(2),
      }));
    }
  }, [formData.noOfMonthsRented, formData.monthlyPrice, isTotalAmountFocused]);

  const handleTotalAmountFocus = () => {
    setIsTotalAmountFocused(true);
  };

  const handleTotalAmountBlur = () => {
    setIsTotalAmountFocused(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer />
      <Sidebar toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
      <div className="flex-1 flex flex-col">
        <TopNav toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Add New Tenant</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Tenant Name', name: 'tenantName', type: 'text' },
                { label: 'Phone Number', name: 'tenantPhone', type: 'text', placeholder: '+233095093095' },
                { label: 'Room Description', name: 'roomDescription', type: 'text' },
                { label: 'Rented Date', name: 'rentedDate', type: 'date' },
                { label: 'Expiration Date', name: 'expirationDate', type: 'date' },
                { label: 'No. of Months Rented', name: 'noOfMonthsRented', type: 'number' },
                { label: 'Utility Amount', name: 'amountPaidOnUtility', type: 'number' },
                { label: 'Monthly Price', name: 'monthlyPrice', type: 'number' },
                { label: 'Total Amount ', name: 'totalAmount', type: 'number' }
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    name={name}
                    type={type}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                    value={formData[name]}
                    placeholder={placeholder}
                    onChange={handleChange}
                    required
                    ref={name === 'totalAmount' ? totalAmountInputRef : null}
                    onFocus={name === 'totalAmount' ? handleTotalAmountFocus : null}
                    onBlur={name === 'totalAmount' ? handleTotalAmountBlur : null}
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
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 text-sm
                    ${loading ? 'opacity-70 scale-95 cursor-wait transition-all duration-300' : 'transition-all duration-300'}`}
                >
                  {loading ? <ProcessingIndicator message="Adding Tenant..." /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}