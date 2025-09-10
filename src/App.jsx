import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Dashboard from "@/pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ExpenseForm from './pages/ExpenseForm';
import TransactionsPage from './pages/TransactionsPage'; 
import ExpenseHistoryPage from './pages/ExpenseHistoryPage';
import IncomeForm from './pages/IncomeForm';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    // ✅ CORRECTED: Check for BOTH the token and the user information
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    // Only set the user as logged in if both items exist
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expense" element={<ExpenseForm />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/expencehistory" element={<ExpenseHistoryPage />} />
         <Route path="/add-income" element={<IncomeForm />} />
      </Routes>
    </>
  );
}

export default App;