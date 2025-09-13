import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
  FiMapPin,
  FiEdit2,
  FiEye,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import { FaCarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { getApartmentProperties, fetchTenantsRecords } from "../APIS/APIS"; // ⬅ added fetchTenantsRecords
import { Banknote } from "lucide-react";
import StatusBadge from "../Components/units/StatusBadge";
import { useProfileContext } from "../Context/fetchProfileContext";
import { logout as apiLogout } from "../APIS/APIS";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StaffPage() {
  const [apartments, setApartments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { clearProfile } = useProfileContext();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    clearProfile();
    navigate("/"); // Redirect to login/home
  };

  const features = [
    "Real-time property tracking",
    "Tenant management",
    "Rent collection",
    "Maintenance requests",
    "Vehicle fleet overview",
    "Booking management",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aptRes, tenantRes] = await Promise.all([
          getApartmentProperties(),
          fetchTenantsRecords(),
        ]);

        setApartments(aptRes?.data || []);
        setTenants(tenantRes?.data || []);
      } catch (err) {
        console.error(err);
        setApartments([]);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (apartments.length > 0) {
      console.log("=== Apartment Dates & Prices ===");
      apartments.forEach((apt, i) => {
        console.log(
          `#${i + 1}`,
          "CreatedAt:",
          apt.createdAt,
          "StartDate:",
          apt.startDate,
          "Price:",
          apt.price,
          "Status:",
          apt.status
        );

        if (apt.tenants) {
          apt.tenants.forEach((t, j) => {
            console.log(
              `   Tenant ${j + 1}`,
              "PaymentDate:",
              t.paymentDate,
              "Amount:",
              t.amount,
              "Status:",
              t.paymentStatus
            );
          });
        }
      });
    }
  }, [apartments]);

  // Metrics calculation
  const metrics = {
    totalProperties: apartments.length,
    tenants: apartments.flatMap((a) => a.tenants || []).length,
    revenue: apartments
      .filter((a) => a.status === "Occupied")
      .reduce((sum, apt) => sum + (parseFloat(apt.price) || 0), 0),
    overduePayments: apartments.flatMap((a) =>
      (a.tenants || []).filter((t) => t.paymentStatus === "Overdue")
    ).length,
  };

  const monthlyRevenue = apartments.reduce((acc, apt) => {
    if (apt.status === "Occupied" && apt.price) {
      const month = new Date(apt.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      acc[month] = (acc[month] || 0) + parseFloat(apt.price);
    }
    return acc;
  }, {});

  // Convert to array for recharts
  const revenueData = Object.keys(monthlyRevenue).map((month) => ({
    month,
    revenue: monthlyRevenue[month],
  }));

  return (
    <>
      {/* ===== Sticky Navbar ===== */}
      {/* <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1
            onClick={() => navigate("/staff")}
            className="text-xl font-bold text-blue-600 cursor-pointer"
          >
            Staff Dashboard
          </h1>

          <div className="flex space-x-6">
            <button
              onClick={() => navigate("/apartments/dashboard")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Property Management
            </button>
            <button
              onClick={() => navigate("/vehicles/dashboard")}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Vehicle Management
            </button>
          </div>
        </div>
      </nav> */}

      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo / Title */}
          <h1
            onClick={() => navigate("/staff")}
            className="text-xl font-bold text-blue-600 cursor-pointer"
          >
            Staff Dashboard
          </h1>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/apartments/dashboard")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Property Management
            </button>
            <button
              onClick={() => navigate("/vehicles/dashboard")}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Vehicle Management
            </button>

            {/* 🚪 Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          {/* ===== Hero Section ===== */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="text-blue-600">Streamline</span> Your Property &
              Vehicle Management
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              All-in-one platform to efficiently manage your real estate and
              vehicle rentals with powerful tools and analytics.
            </motion.p>
          </div>

          {/* ===== Summary Cards ===== */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                <span className="text-gray-500 text-sm">Total Properties</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metrics.totalProperties}
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                <span className="text-gray-500 text-sm">Total Tenants</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metrics.tenants}
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                <span className="text-gray-500 text-sm">Monthly Revenue</span>
                <span className="text-2xl font-bold text-green-600">
                  GH₵{metrics.revenue.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                <span className="text-gray-500 text-sm">Due Payments</span>
                <span className="text-2xl font-bold text-red-600">
                  {metrics.overduePayments}
                </span>
              </div>
            </div>
          )}

          {/* ===== Revenue Trends Chart ===== */}
          {!loading && revenueData.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-md mb-16">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Revenue Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `GH₵${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `GH₵${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#1E3A8A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ===== Financial Health Dashboard ===== */}
          {!loading && (
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Financial Health Dashboard
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Late Payments */}
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                  <span className="text-red-600 font-medium flex items-center mb-2">
                    <i className="fas fa-clock mr-2"></i> Late Payments
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    {metrics.overduePayments}
                  </span>
                  <span className="text-sm text-gray-500">
                    Overdue rent payments
                  </span>
                </div>

                {/* Monthly Cash Flow */}
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                  <span className="text-green-600 font-medium flex items-center mb-2">
                    <i className="fas fa-dollar-sign mr-2"></i> Monthly Cash
                    Flow
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    GH₵{(metrics.revenue - 0).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Revenue minus expenses
                  </span>
                </div>

                {/* Avg. Rent */}
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                  <span className="text-blue-600 font-medium flex items-center mb-2">
                    <i className="fas fa-calculator mr-2"></i> Avg. Rent
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    GH₵
                    {(
                      apartments.reduce(
                        (sum, apt) => sum + (parseFloat(apt.price) || 0),
                        0
                      ) / (apartments.length || 1)
                    ).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Average rent per unit
                  </span>
                </div>

                {/* Upcoming Renewals */}
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start">
                  <span className="text-purple-600 font-medium flex items-center mb-2">
                    <i className="fas fa-calendar-alt mr-2"></i> Upcoming
                    Renewals
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    {
                      apartments.filter((apt) => {
                        if (!apt.endDate) return false;
                        const end = new Date(apt.endDate);
                        const now = new Date();
                        const diff = (end - now) / (1000 * 60 * 60 * 24);
                        return diff > 0 && diff <= 30;
                      }).length
                    }
                  </span>
                  <span className="text-sm text-gray-500">
                    Leases expiring in 30 days
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===== Property Cards ===== */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Properties
          </h2>

          {!loading && apartments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {apartments
                .slice() // make a copy first
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
                .slice(0, 4) // only 4 latest
                .map((apt) => (
                  <div
                    key={apt._id}
                    className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 truncate">
                          {apt.title}
                        </h2>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <FiMapPin className="mr-1" />
                          {apt.location}
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    <div className="flex justify-between mb-3">
                      <div className="flex items-center text-blue-600 font-medium">
                        <Banknote className="mr-1" size={16} />
                        GHC {apt.price}/mo
                      </div>
                      <div className="flex items-center text-purple-600 text-sm">
                        <FiUsers className="mr-1" size={14} />
                        {apt.tenantCount}{" "}
                        {apt.tenantCount === 1 ? "Tenant" : "Tenants"}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {apt.description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
                      {/* <button
                        onClick={() => navigate(`/apartments/${apt._id}`)}
                        className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                      >
                        <FiEye className="mr-1" /> View
                      </button> */}
                      <button
                        onClick={() => navigate(`/apartment/edit/${apt._id}`)}
                        className="flex items-center text-yellow-500 hover:text-yellow-600 text-sm"
                      >
                        <FiEdit2 className="mr-1" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ===== Recent Tenants ===== */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Tenants
          </h2>

          {!loading && tenants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {tenants
                .slice()
                .sort((a, b) => new Date(b.rentedDate) - new Date(a.rentedDate))
                .slice(0, 3)
                .map((t) => (
                  <div
                    key={t._id}
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {t.tenantName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiPhone className="mr-1" /> {t.tenantPhone}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <span className="block truncate">
                        Apartment: {t.apartment?.title || "N/A"}
                      </span>
                      <div className="flex items-center mt-1">
                        <FiCalendar className="mr-1" />
                        {new Date(t.rentedDate).toLocaleDateString()} -{" "}
                        {new Date(t.expirationDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">
                        GHC {(t.totalAmount || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          navigate(`/apartments/tenant/edit/${t._id}`)
                        }
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ===== Feature Cards ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiHome className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Property Management
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Comprehensive tools to manage all aspects of your rental
                properties from tenant screening to maintenance.
              </p>
              <button
                onClick={() => navigate("/apartments/dashboard")}
                className="flex items-center text-blue-600 font-medium group"
              >
                Go to Dashboard
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaCarAlt className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Vehicle Rentals
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Complete solution for managing your vehicle fleet, bookings,
                maintenance, and customer relations.
              </p>
              <button
                onClick={() => navigate("/vehicles/dashboard")}
                className="flex items-center text-green-600 font-medium group"
              >
                Go to Dashboard
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* ===== Features List ===== */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== CTA Section ===== */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Ready to get started?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/apartments/dashboard")}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <FiHome className="mr-2" />
                Manage Properties
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/vehicles/dashboard")}
                className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <FaCarAlt className="mr-2" />
                Manage Vehicles
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
