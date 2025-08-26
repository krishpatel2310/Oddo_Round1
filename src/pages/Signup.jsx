import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.type === "text" ? "name" : e.target.type]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", form);
    // TODO: Send request to backend
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <InputField label="Name" type="text" value={form.name} onChange={handleChange} />
        <InputField label="Email" type="email" value={form.email} onChange={handleChange} />
        <InputField label="Password" type="password" value={form.password} onChange={handleChange} />
        <Button text="Sign Up" type="submit" />
      </form>
    </div>
  );
}
