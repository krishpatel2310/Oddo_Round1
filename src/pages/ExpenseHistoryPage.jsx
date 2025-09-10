// In src/pages/ExpenseHistoryPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft } from 'lucide-react';

export default function ExpenseHistoryPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("You must be logged in to view expenses.");
          setIsLoading(false);
          return;
        }

        // This calls your existing, corrected /api/expenses endpoint
        const response = await axios.get('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(response.data);

      } catch (err) {
        setError("Failed to fetch expenses.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (isLoading) {
    return <div className="text-center text-white mt-20">Loading expenses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Expense History</h1>

        {expenses.length === 0 ? (
          <p className="text-slate-400">You have not added any expenses yet.</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense._id} className="bg-slate-800 border-slate-700 p-4">
                <CardContent className="flex items-center justify-between p-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <ArrowDownLeft className="text-red-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">{expense.description || 'No description'}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(expense.date).toLocaleDateString()} • {expense.category}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-red-400">
                    -₹{expense.amount.toLocaleString('en-IN')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}