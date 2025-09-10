// In src/pages/TransactionsPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft } from 'lucide-react'; // Icon for expenses

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        // This now calls your corrected /api/transactions endpoint
        const response = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return <div className="text-center text-white mt-20">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  }

  // Note: This assumes your Transaction model has fields like
  // 'description', 'date', 'category', and 'amount'.
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Transaction History</h1>

        {transactions.length === 0 ? (
          <p className="text-slate-400">You have no transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <Card key={tx._id} className="bg-slate-800 border-slate-700 p-4">
                <CardContent className="flex items-center justify-between p-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <ArrowDownLeft className="text-red-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">{tx.description || 'No description'}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(tx.date).toLocaleDateString()} • {tx.category}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-red-400">
                    -₹{tx.amount.toLocaleString('en-IN')}
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