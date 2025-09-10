import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Login({ setUser }) {   // 👈 accept setUser from App.jsx
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

      // Save JWT + user to localStorage
      localStorage.setItem("authToken", data.authtoken);
      localStorage.setItem("user", JSON.stringify(data.user));
       // ADD THIS LINE
       
      console.log("LOGIN PAGE: Token successfully saved to localStorage:", data.authtoken);
        
      

      // 👇 Immediately update global React state so Navbar updates
      setUser(data.user);

      navigate("/dashboard");
    } catch (err) {
      setError("Network error, please try again");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side */}
      <div className="hidden lg:flex flex-1 flex-col justify-center bg-gradient-to-br from-indigo-800 to-teal-700 text-white p-16">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          ExpenseTracker
        </h1>
        <p className="text-lg text-indigo-100 max-w-md">
          Take control of your money. Track expenses, set goals, and gain insights
          into your financial health with ease.
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center bg-slate-900">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-slate-800 p-10 rounded-xl shadow-xl border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-100">
            Sign In
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <div className="mt-6">
            <Button
              text="Login"
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 shadow-md"
            />
          </div>
          <p className="text-sm text-slate-400 text-center mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-teal-400 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
