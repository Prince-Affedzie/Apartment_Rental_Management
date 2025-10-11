import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, addNewUser } from "../APIS/APIS";
import ProcessingIndicator from "../Components/units/processingIndicator";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useProfileContext } from "../Context/fetchProfileContext";

// Password input component
const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder,
  showKey,
  showPasswords,
  setShowPasswords,
}) => {
  const isVisible = showPasswords[showKey];
  const toggle = useCallback(() => {
    setShowPasswords((prev) => ({
      ...prev,
      [showKey]: !prev[showKey],
    }));
  }, [showKey, setShowPasswords]);

  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pr-10 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div
        onClick={toggle}
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
      >
        {isVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
      </div>
    </div>
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getProfile, setProfile } = useProfileContext();
  // const { getProfile, setProfile, profile } = useProfileContext(); // <-- include profile

  const [activeForm, setActiveForm] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    password: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({});

  const routeByRole = (role) => {
    const r = (role || "").toLowerCase();
    if (r === "admin") {
      navigate("/home");
    } else if (r === "staff" || r === "manager") {
      navigate("/staff");
    } else {
      navigate("/"); // fallback
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const response = await login(payload);
      if (response.status === 200) {
        toast.success("Login Successful");
        let userData = response.data;
        let role = userData?.role;

        if (userData && role) {
          // Put server response directly into context
          setProfile(userData);
        } else {
          // Fallback: fetch profile (returns it now)
          const prof = await getProfile();
          role = prof?.role;
        }

        if (!role) {
          toast.error("Unable to determine user role.");
          return;
        }

        console.log("Routing with role:", role);
        routeByRole(role);
      } else {
        toast.error(response.error || "Login failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle signup form changes
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Add new user
  const handleAddUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await addNewUser(newUser);
      if (response.status === 201 || response.status === 200) {
        toast.success("User Sign-Up successfully!");
        setNewUser({
          name: "",
          email: "",
          phone: "",
          role: "Staff",
          password: "",
          confirmPassword: "",
        });
        setActiveForm("login");
      } else {
        toast.error(response.error || "Failed to add user.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Sign-Up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex font-sans bg-gray-50">
      <ToastContainer />

      {/* Left Section → Forms */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 sm:px-16 bg-white overflow-y-auto shadow-lg">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Property Tracking System
        </h2>

        {/* Switch Tabs */}
        <div className="flex justify-center mb-6">
          <div className="relative flex w-full max-w-xs bg-gray-100 py-1 rounded-xl shadow-inner">
            {/* Highlight / Sliding Indicator */}
            <div
              className={`absolute top-1 left-1 w-[calc(50%-0.5rem)] h-8 bg-blue-600 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                activeForm === "signup"
                  ? "translate-x-[calc(100%+0.5rem)]"
                  : "translate-x-0"
              }`}
            ></div>

            {/* Login Button */}
            <button
              onClick={() => setActiveForm("login")}
              className={`relative z-10 w-1/2 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeForm === "login" ? "text-white" : "text-gray-600"
              }`}
            >
              Login
            </button>

            {/* Signup Button */}
            <button
              onClick={() => setActiveForm("signup")}
              className={`relative z-10 w-1/2 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeForm === "signup" ? "text-white" : "text-gray-600"
              }`}
            >
              Signup
            </button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-2xl   py-8 px-4 bg-blue-50">
          {/* LOGIN FORM */}
          <div
            className={`transition-all duration-300 ${
              activeForm === "login" ? "block" : "hidden"
            }`}
          >
            <form
              onSubmit={handleLogin}
              className="space-y-6 py-8 max-w-md mx-auto"
              // className="space-y-4 py-4 max-w-lg mx-auto"
            >
              <h3 className="text-2xl font-bold text-gray-700 text-center">
                Welcome Back
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  // className="w-full px-3 py-2 text-md border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    // className="w-full px-3 py-2 text-md border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={22} />
                    ) : (
                      <AiFillEye size={22} />
                    )}
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 text-md rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
              >
                {loading ? (
                  <ProcessingIndicator message="Logging you in..." />
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Switch to Signup */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <span
                  onClick={() => setActiveForm("signup")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>

          {/* SIGNUP FORM */}

          {/* <div
            className={`transition-all duration-300 ${
              activeForm === "signup" ? "block" : "hidden"
            }`}
          >
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-gray-700 text-center">
                Create Account
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleNewUserChange}
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div> */}

          {/* <label className="block text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </select> */}

          {/* Default for Staff */}

          {/* <label className="block text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <input
                    name="role"
                    value="Staff"
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed bg-gray-100"
                  /> */}

          {/* </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <PasswordInput
                    name="password"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Password"
                    showKey="signupPassword"
                    showPasswords={showPasswords}
                    setShowPasswords={setShowPasswords}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Confirm Password
                  </label>
                  <PasswordInput
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    placeholder="Confirm Password"
                    showKey="signupConfirmPassword"
                    showPasswords={showPasswords}
                    setShowPasswords={setShowPasswords}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Signup Button */}
          {/* <button
                onClick={handleAddUser}
                disabled={loading}
                // className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md"
                className="w-full bg-blue-600 text-white py-3 text-md rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
              >
                {loading ? "Signing-Up User..." : "Sign Up"}
              </button>

              {/* Switch to Login */}
          {/* <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => setActiveForm("login")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </div>
          </div>   */}

          {/* SIGNUP FORM */}
          <div
            className={`transition-all duration-300 ${
              activeForm === "signup" ? "block" : "hidden"
            }`}
          >
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-gray-700 text-center">
                Create Account
              </h3>

              {/* Name (full row) */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl 
                   bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email + Phone (same row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl 
                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleNewUserChange}
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl 
                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password + Confirm Password (same row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <PasswordInput
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Password"
                    showKey="signupPassword"
                    showPasswords={showPasswords}
                    setShowPasswords={setShowPasswords}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl 
                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Confirm Password
                  </label>
                  <PasswordInput
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    placeholder="Confirm Password"
                    showKey="signupConfirmPassword"
                    showPasswords={showPasswords}
                    setShowPasswords={setShowPasswords}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl 
                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Signup Button */}
              <button
                onClick={handleAddUser}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 text-md rounded-xl 
                 hover:bg-blue-700 transition-all font-semibold shadow-md"
              >
                {loading ? "Signing-Up User..." : "Sign Up"}
              </button>

              {/* Switch to Login */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => setActiveForm("login")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Powered by </span>
          <a
            href="https://prostechnologies.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline"
          >
            PROS Technologies
          </a>
        </div>
      </div>

      {/* Right Section → Info */}
      <div className="hidden md:flex w-1/2 h-full bg-blue-100 flex-col justify-center p-16">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Manage Your Properties Effortlessly
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Property Tracking System helps landlords and property managers
          streamline their rental business with powerful yet simple tools.
        </p>
        <ul className="space-y-5 text-gray-700 text-base">
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            Track rent payments and manage finances with ease
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            Organize tenant information and lease details
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            Monitor property maintenance and track expenses
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            View comprehensive analytics on your rental portfolio
          </li>
        </ul>
      </div>
    </div>
  );
}
