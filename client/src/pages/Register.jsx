import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "", // corrected to match backend
    password: "",
    confirmPassword: "",
    role: "student", // default role
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validate = () => {
    const err = {};

    // Name validation
    if (!formData.fullName.trim()) {
      err.fullName = "Full Name is required";
    } else if (formData.fullName.trim().length < 3) {
      err.fullName = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      err.email = "Invalid email address";
    }

    // Mobile number validation
    if (!formData.mobileNumber.trim()) {
      err.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      err.mobileNumber = "Mobile number must be 10 digits";
    }

    // Password validation
    if (!formData.password) {
      err.password = "Password is required";
    } else if (formData.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      err.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!formData.role) {
      err.role = "Please select a role";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message || "Registration Successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 px-3">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl rounded-xl">
        <div className="card-body px-5 py-4">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white shadow mb-2">
              {formData.role === "student" ? (
                <FaUserGraduate size={22} />
              ) : (
                <FaChalkboardTeacher size={22} />
              )}
            </div>
            <h2 className="text-xl font-bold leading-tight">
              {formData.role === "student"
                ? "Student Registration"
                : "Teacher Registration"}
            </h2>
            <p className="text-gray-500 text-xs">Create your account</p>
          </div>

          {/* Role Selector */}
          <div className="tabs tabs-boxed justify-center mb-3 text-sm">
            <button
              type="button"
              className={`tab gap-1 ${formData.role === "student" ? "tab-active" : ""}`}
              onClick={() => setFormData((p) => ({ ...p, role: "student" }))}
            >
              <FaUserGraduate size={14} /> Student
            </button>
            <button
              type="button"
              className={`tab gap-1 ${formData.role === "teacher" ? "tab-active" : ""}`}
              onClick={() => setFormData((p) => ({ ...p, role: "teacher" }))}
            >
              <FaChalkboardTeacher size={14} /> Teacher
            </button>
          </div>
          {errors.role && <p className="text-error text-xs text-center">{errors.role}</p>}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* FULL NAME */}
            <div>
              <div className="relative">
                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="input input-bordered input-sm w-full pl-9"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && <p className="text-error text-xs">{errors.fullName}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered input-sm w-full pl-9"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-error text-xs">{errors.email}</p>}
            </div>

            {/* MOBILE NUMBER */}
            <div>
              <div className="relative">
                <FaPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  className="input input-bordered input-sm w-full pl-9"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              {errors.mobileNumber && <p className="text-error text-xs">{errors.mobileNumber}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered input-sm w-full pl-9"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="text-error text-xs">{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="input input-bordered input-sm w-full pl-9"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-sm w-full mt-3"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-xs mt-3">
            Already have an account?{" "}
            <span
              className="link link-primary font-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;