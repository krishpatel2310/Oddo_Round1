import { useState } from 'react';
import axios from 'axios';

// --- SVG Icons ---
// The unused CardIcon has been removed.

const RupeeIcon = () => <span className="text-gray-500">₹</span>;
const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" />
  </svg>
);
const DateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);


// --- The Enhanced Component ---

const UnifiedTransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    description: '',
    // paymentMethod has been removed from state
    source: '',
    incomeType: 'Salary',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    if (feedback.message) {
      setFeedback({ type: '', message: '' });
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setFeedback({ type: 'error', message: 'Please enter a valid amount.' });
        return;
    }
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const token = localStorage.getItem('authToken');
      
      const transactionData = {
        transactionType: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        ...(formData.type === 'income' ? {
          source: formData.source,
          incomeType: formData.incomeType,
          note: formData.note
        } : {
          category: formData.category,
          description: formData.description
          // paymentMethod has been removed from the data payload
        })
      };

      const response = await axios.post('http://localhost:5000/api/transactions', transactionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check for budget alert
      if (response.data.budgetAlert) {
        const alert = response.data.budgetAlert;
        setFeedback({ 
          type: alert.type === 'error' ? 'warning' : 'info', 
          message: `Transaction added! ${alert.message}` 
        });
      } else {
        setFeedback({ type: 'success', message: `${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!` });
      }
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Food',
        description: '',
        source: '',
        incomeType: 'Salary',
        note: ''
      });
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
    } catch (error) {
      setFeedback({ type: 'error', message: 'Error: ' + (error.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Others'];
  const incomeTypes = ['Salary', 'Bonus', 'Investment', 'Freelance', 'Gift', 'Other'];
  // paymentMethods array has been removed

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md mx-auto">
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold text-gray-800">Add Transaction</h1>
        <p className="text-gray-500">Record a new income or expense</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`rounded-lg p-4 text-left border-2 flex items-center transition-all ${
                formData.type === 'expense' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="bg-red-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                 <span className="text-red-600 font-bold">₹</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Expense</p>
                <p className="text-xs text-gray-500">Money going out</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`rounded-lg p-4 text-left border-2 flex items-center transition-all ${
                formData.type === 'income' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
               <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                 <span className="text-green-600 font-bold">₹</span>
              </div>
               <div>
                <p className="font-semibold text-gray-800">Income</p>
                <p className="text-xs text-gray-500">Money coming in</p>
              </div>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center"><RupeeIcon /></div>
                <input
                    type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange}
                    required min="0.01" step="0.01"
                    className="w-full text-black p-3 pl-10 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    placeholder="0.00"
                />
            </div>
        </div>

        {/* Date */}
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center"><DateIcon /></div>
                <input
                    type="date" name="date" id="date" value={formData.date} onChange={handleChange} required
                    className="text-black w-full p-3 pl-10 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
            </div>
        </div>

        {/* Expense Fields */}
        {formData.type === 'expense' && (
          <>
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                  <div className="text-black pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center"><CategoryIcon /></div>
                  <select
                      name="category" id="category" value={formData.category} onChange={handleChange} required
                      className="text-black w-full p-3 pl-10 pr-10 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none transition"
                  >
                      {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="text-black pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center"><ChevronDownIcon /></div>
              </div>
            </div>

            {/* --- Payment Method Field has been removed --- */}
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-gray-400">(Optional)</span></label>
              <input
                type="text" name="description" id="description" value={formData.description} onChange={handleChange}
                className=" text-black w-full p-3 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., Lunch with colleagues"
              />
            </div>
          </>
        )}

        {/* Income Fields */}
        {formData.type === 'income' && (
          <>
            {/* Income Type */}
            <div>
              <label htmlFor="incomeType" className="block text-sm font-medium text-gray-700 mb-2">Income Type</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center"><CategoryIcon /></div>
                <select
                  name="incomeType" id="incomeType" value={formData.incomeType} onChange={handleChange} required
                  className=" text-black w-full p-3 pl-10 pr-10 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none transition"
                >
                  {incomeTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center"><ChevronDownIcon /></div>
              </div>
            </div>
            
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <input
                type="text" name="source" id="source" value={formData.source} onChange={handleChange} required
                className=" text-black w-full p-3 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., Company Name"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">Note <span className="text-gray-400">(Optional)</span></label>
              <input
                type="text" name="note" id="note" value={formData.note} onChange={handleChange}
                className="text-black w-full p-3 bg-zinc-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., Monthly salary"
              />
            </div>
          </>
        )}
        
        {/* Inline Feedback Message */}
        {feedback.message && (
          <div
            className={`p-3 rounded-lg text-sm text-center font-medium ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {feedback.message}
            
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  );
};

export default UnifiedTransactionForm;