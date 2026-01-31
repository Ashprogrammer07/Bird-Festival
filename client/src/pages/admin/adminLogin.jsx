import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuthAPI } from "../../services/adminApi";
// Added ArrowLeft to imports
import { Mail, Lock, Loader2, Bird, AlertCircle, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "admin@example.com", password: "Admin@123" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await adminAuthAPI.login(form);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      navigate("/admin");
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 p-4">
      {/* Added 'relative' class here to position the back button */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* --- NEW: Back to Home Button --- */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-green-200 hover:text-white transition-colors flex items-center gap-1 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Home</span>
        </button>
        {/* -------------------------------- */}

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="bg-green-500/20 p-3 rounded-full mb-4">
            <Bird className="w-10 h-10 text-green-300" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Admin Portal
          </h2>
          <p className="text-green-200 text-sm mt-1">
            Birds Festival Management
          </p>
        </div>

        {/* Global API Error Alert */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-200 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 ${errors.email ? "text-red-400" : "text-green-300 group-focus-within:text-white"} transition-colors`} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.email ? "border-red-500/50 focus:border-red-500" : "border-green-300/30 focus:border-green-400"
                  } rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-all`}
                onChange={handleChange}
                value={form.email}
              />
            </div>
            {errors.email && <p className="text-red-300 text-xs pl-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${errors.password ? "text-red-400" : "text-green-300 group-focus-within:text-white"} transition-colors`} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.password ? "border-red-500/50 focus:border-red-500" : "border-green-300/30 focus:border-green-400"
                  } rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-all`}
                onChange={handleChange}
                value={form.password}
              />
            </div>
            {errors.password && <p className="text-red-300 text-xs pl-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-900/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : "Login Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;