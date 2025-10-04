import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import the new Layout component
import Layout from '@/components/layout'; 

// Import your page components
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ExpenseHistoryPage from './pages/ExpenseHistoryPage';
import Reminders from './pages/Reminders';
import AddTransaction from './pages/AddTransaction';
import BudgetManagement from './pages/BudgetManagement';

import { Settings } from 'lucide-react';
import SettingsPage from './pages/Settings';

// Helper component to protect routes
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Stop loading once user check is complete
  }, []);

  // Show a loading indicator while checking for user session
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Checking authentication status</p>
        </div>
      </div>
    );
  }



  return (
    <Routes>

     
      <Route element={<Layout user={user} setUser={setUser} />}>
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/expencehistory" 
          element={<ProtectedRoute user={user}><ExpenseHistoryPage /></ProtectedRoute>} 
        />
        <Route 
          path="/reminders" 
          element={<ProtectedRoute user={user}><Reminders /></ProtectedRoute>} 
        />
        <Route 
          path="/add-transaction" 
          element={<ProtectedRoute user={user}><AddTransaction /></ProtectedRoute>} 
        />
        <Route 
          path="/budget-management" 
          element={<ProtectedRoute user={user}><BudgetManagement /></ProtectedRoute>} 
        />      
        <Route 
          path="/settings"
          element={<ProtectedRoute user={user}><SettingsPage /></ProtectedRoute>}
        /> 
      </Route>

      
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/signup" element={<Signup />} />

    
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      
      {/* Catch-all route for unmatched paths */}
      <Route 
        path="*" 
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;