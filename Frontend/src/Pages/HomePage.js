import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to Your Property Manager
      </h1>
      <p className="text-gray-600 text-lg mb-10 text-center max-w-xl">
        Choose which service you'd like to manage today. Everything is just a click away.
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => navigate("/apartments/dashboard")}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-700 w-72 text-lg"
        >
          🏢 Apartment Management
        </button>
        <button
          onClick={() => navigate("/vehicles/dashboard")}
          className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-green-700 w-72 text-lg"
        >
          🚗 Car Rental Management
        </button>
      </div>
    </div>
  );
}
