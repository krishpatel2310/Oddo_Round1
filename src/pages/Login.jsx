import { useState } from "react";
import { useNavigate } from "react-router-dom";

// No longer importing custom components
// import InputField from "../components/InputField";
// import Button from "../components/Button";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("authToken", data.authtoken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      console.log("LOGIN PAGE: Token successfully saved to localStorage:", data.authtoken);
      
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Network error, please try again");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-400">
                ExpenseTracker
            </h1>
            <p className="text-slate-500 mt-2">Welcome back! Please sign in to your account.</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-8 rounded-xl shadow-md border border-slate-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-700">
            Sign In
          </h2>

          {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

          {/* --- Replaced custom InputField with standard HTML --- */}
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-8">
            {/* --- Replaced custom Button with standard HTML --- */}
            <button
              type="submit"
              className="w-full text-white font-bold py-2 px-4 rounded-md shadow-md bg-gradient-to-r from-blue-500 to-pink-400 hover:from-blue-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Login
            </button>
          </div>
          <p className="text-sm text-slate-500 text-center mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}