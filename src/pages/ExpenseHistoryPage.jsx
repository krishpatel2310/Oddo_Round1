// Transaction History Page - shows all income and expense transactions

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Filter, Search, SortAsc, SortDesc, Calendar, X } from 'lucide-react';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Fetch all transactions once
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("You must be logged in to view transactions.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data.transactions || response.data || []);

      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  
  useEffect(() => {
    let filtered = [...transactions];

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.transactionType === filter);
    }

    
    if (searchTerm) {
      filtered = filtered.filter(transaction => {
        const searchableText = [
          transaction.transactionType === 'income' 
            ? (transaction.source || '')
            : (transaction.description || transaction.category || ''),
          transaction.category || '',
          transaction.incomeType || '',
          transaction.note || '',
          transaction.amount.toString()
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm.toLowerCase());
      });
    }

   
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'name':
          aValue = (a.transactionType === 'income' 
            ? (a.source || '')
            : (a.description || a.category || '')).toLowerCase();
          bValue = (b.transactionType === 'income' 
            ? (b.source || '')
            : (b.description || b.category || '')).toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, filter, searchTerm, sortBy, sortOrder]);

  if (isLoading) {
    return <div className="text-center text-white mt-20">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Transaction History</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by description, category, amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'income' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'expense' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Expenses
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="name">Name</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            {transactions.length === 0 ? (
              <p className="text-slate-400">You have not added any transactions yet.</p>
            ) : (
              <p className="text-slate-400">No transactions match your search criteria.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.transactionType === 'income';
              return (
                <Card key={transaction._id} className="bg-slate-800 border-slate-700 p-4">
                  <CardContent className="flex items-center justify-between p-0">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        isIncome ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {isIncome ? (
                          <ArrowUpRight className="text-green-400" size={20} />
                        ) : (
                          <ArrowDownLeft className="text-red-400" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {isIncome 
                            ? (transaction.source || 'Income')
                            : (transaction.description || transaction.category || 'Expense')}
                        </p>
                        <p className="text-sm text-slate-400">
                          {new Date(transaction.date).toLocaleDateString()} • 
                          {isIncome 
                            ? (transaction.incomeType || 'Income')
                            : (transaction.category || 'Expense')}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${
                      isIncome ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}