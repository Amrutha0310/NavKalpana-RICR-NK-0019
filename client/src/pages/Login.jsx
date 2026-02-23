import React, { useState } from "react";
import { TbLockPassword } from "react-icons/tb";
import { MdOutlineMailOutline } from "react-icons/md";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//import Loading from "../components/Loading";
const Login = () => {
  const { setUser, setIsLogin, setRole } = useAuth();
  // const [isForgetPassModalOpen, setIsForgetPassModalOpen] = useState(false);

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setLoginData({ email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(loginData);

    try {
      const res = await api.post("/auth/login", loginData);
      toast.success(res.data.message);

      setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("LearningUser", JSON.stringify(res.data.data));
      window.dispatchEvent(new Event("userLogin"));

      handleClearForm();
      switch (res.data.data.role) {
        case "teacher": {
          setRole("teacher");
          navigate("/teacher-dashboard");
          break;
        }

        case "student": {
          setRole("student");
          navigate("/student-dashboard");
          break;
        }
        case "admin": {
          setRole("admin");
          navigate("/admin-dashboard");
          break;
        }

        default:
          break;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-100 h-100 flex items-center justify-center">
        Loading..
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-base-200 `bg-linear-to-br` from-indigo-100 via-blue-100 to-purple-100 px-3">
        <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-primary">
          <div className="card-body">

            <div className="text-center mb-3">
              <h2 className="text-3xl font-bold text-primary">
                Student Portal Login 🎓
              </h2>
              <p className="text-sm text-base-content/70 mt-1">
                Access your learning dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} onReset={handleClearForm}>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <div className="relative">
                  <MdOutlineMailOutline className="absolute left-3 top-3 text-lg text-primary" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="input input-bordered w-full pl-10 focus:input-primary"
                  />
                </div>
              </div>


              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative">
                  <TbLockPassword className="absolute left-3 top-3 text-lg text-primary" />
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="input input-bordered w-full pl-10 focus:input-primary"
                  />
                </div>
              </div>


              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>
              </div>


              <div className="text-center mt-4 text-sm">
                <button type="button" className="link link-primary">
                  Forgot Password?
                </button>
              </div>

              <div className="text-center mt-2 text-sm">
                <span>New Student?</span>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="link link-secondary ml-1"
                >
                  Register Here
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
