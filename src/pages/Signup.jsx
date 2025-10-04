import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation

export default function Signup() {
    const navigate = useNavigate(); 
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Clear previous errors on a new submission

        try {
            await axios.post(
                'http://localhost:5000/api/users/registerUser',
                form
            );
            
            // Navigate to the login page after successful signup
            navigate("/login"); 
    
        } catch (err) {
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.message || err.response.data.error || "An error occurred.";
                setError(errorMessage);
            } else {
                setError("An unexpected network error occurred. Please try again.");
            }
            console.error("Signup Error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-400">
                        ExpenseTracker
                    </h1>
                    <p className="text-slate-500 mt-2">Create an account to start managing your finances.</p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full bg-white p-8 rounded-xl shadow-md border border-slate-200"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center text-slate-700">
                        Create Account
                    </h2>

                    {/* Error Message Display */}
                    {error && 
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4 text-center text-sm" role="alert">
                            <span>{error}</span>
                        </div>
                    }

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text" // Type should be "text" for a name
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
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
                        <button
                            type="submit"
                            disabled={isLoading} // Disable button when loading
                            className="w-full text-white font-bold py-2.5 px-4 rounded-md shadow-md bg-gradient-to-r from-blue-500 to-pink-400 hover:from-blue-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 text-center mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}