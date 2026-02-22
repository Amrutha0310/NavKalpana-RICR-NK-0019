import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/public/new-contact", formData);
      toast.success(res.data.message || "Query submitted successfully");
      handleClearForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left Info Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">
            LMS Help & Support
          </h1>

          <p className="text-base-content/70 mb-6">
            Have a doubt related to courses, assignments, or progress?
            Our mentors and support team will get back to you shortly.
          </p>

          <ul className="space-y-2 text-sm text-base-content/80">
            <li>✔ Course access issues</li>
            <li>✔ Assignment & submission queries</li>
            <li>✔ Progress / certification support</li>
            <li>✔ Technical issues</li>
          </ul>
        </div>

        {/* Right Form Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-4">
              Post Your Query
            </h2>

            <form
              onSubmit={handleSubmit}
              onReset={handleClearForm}
              className="space-y-4"
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="input input-bordered w-full"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="input input-bordered w-full"
              />

              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                maxLength="10"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="input input-bordered w-full"
              />

              <textarea
                name="message"
                placeholder="Describe your query or issue..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="textarea textarea-bordered w-full"
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="reset"
                  disabled={isLoading}
                  className="btn btn-outline w-1/2"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-1/2"
                >
                  {isLoading ? "Submitting..." : "Submit Query"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     </div>
        
     
  );
};

export default Contact;