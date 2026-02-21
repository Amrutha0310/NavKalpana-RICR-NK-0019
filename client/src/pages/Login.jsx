import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({ email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      toast.success(res.data.message);

      // optional: store user or token
      sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));

      handleClearForm();

      // simple redirect
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <h2 className="card-title text-3xl justify-center text-primary">
              Login
            </h2>
            <p className="text-center text-base-content/70 mb-6">
              Welcome back 👋
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              onReset={handleClearForm}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="input input-bordered w-full"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="input input-bordered w-full"
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="reset"
                  disabled={isLoading}
                  className="btn btn-secondary btn-outline flex-1"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary flex-1"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-6">
          Your data is safe with us 🔐
        </p>
      </div>
    </div>
  );
};

export default Login;