import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertTriangle, TrendingUp, TrendingDown, PlusCircle, Target, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import BudgetCharts from '../components/BudgetCharts';
import BudgetForm from '../components/BudgetForm';
import axios from 'axios';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetAnalytics, setBudgetAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  // Helper function to format currency in Rupees
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '₹0';
    return `₹${numAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login first');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      // Get current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      console.log('Loading budgets for:', { month: currentMonth, year: currentYear });
      
      // Load budgets with month/year parameters
      const budgetsResponse = await axios.get(`http://localhost:5000/api/budgets?month=${currentMonth}&year=${currentYear}`, { headers });
      console.log('Budgets response:', budgetsResponse.data);
      setBudgets(budgetsResponse.data.budgets || []);

      // Load analytics with month/year parameters
      const analyticsResponse = await axios.get(`http://localhost:5000/api/budgets/analytics?month=${currentMonth}&year=${currentYear}`, { headers });
      console.log('Analytics response:', analyticsResponse.data);
      setBudgetAnalytics(analyticsResponse.data);
      
    } catch (error) {
      console.error('Error loading budget data:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('BudgetManagement component mounted, loading data...');
    loadBudgetData();
  }, []);

  const handleBudgetSaved = async (budgetData) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Add current month and year to budget data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const budgetPayload = {
        ...budgetData,
        month: currentMonth,
        year: currentYear
      };
      
      console.log('Saving budget with data:', budgetPayload);
      
      if (selectedBudget) {
        // Update existing budget
        const response = await axios.put(`http://localhost:5000/api/budgets/${selectedBudget._id}`, budgetPayload, { headers });
        console.log('Update response:', response.data);
      } else {
        // Create new budget
        const response = await axios.post('http://localhost:5000/api/budgets', budgetPayload, { headers });
        console.log('Create response:', response.data);
      }
      
      setShowForm(false);
      setSelectedBudget(null);
      loadBudgetData();
    } catch (error) {
      console.error('Error saving budget:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadBudgetData();
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget');
    }
  };

  // Test function to create sample budgets with different spending levels
  const createTestBudget = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Create multiple test budgets
      const testBudgets = [
        {
          category: 'Food',
          budgetAmount: 1000,
          period: 'monthly',
          alertThreshold: 80,
          alertEnabled: true,
          month: currentMonth,
          year: currentYear
        },
        {
          category: 'Transport',
          budgetAmount: 500,
          period: 'monthly',
          alertThreshold: 80,
          alertEnabled: true,
          month: currentMonth,
          year: currentYear
        },
        {
          category: 'Shopping',
          budgetAmount: 800,
          period: 'monthly',
          alertThreshold: 80,
          alertEnabled: true,
          month: currentMonth,
          year: currentYear
        }
      ];
      
      console.log('Creating test budgets:', testBudgets);
      
      for (const testBudget of testBudgets) {
        try {
          const response = await axios.post('http://localhost:5000/api/budgets', testBudget, { headers });
          console.log(`Test budget created for ${testBudget.category}:`, response.data);
        } catch (budgetError) {
          console.log(`Budget for ${testBudget.category} might already exist:`, budgetError.response?.data);
        }
      }
      
      // Now create some test transactions to simulate spending
      const testTransactions = [
        {
          transactionType: 'expense',
          amount: 1500, // This will cause overspending in Food category
          category: 'Food',
          description: 'Grocery shopping',
          month: currentMonth,
          year: currentYear
        },
        {
          transactionType: 'expense',
          amount: 200,
          category: 'Transport',
          description: 'Fuel',
          month: currentMonth,
          year: currentYear
        },
        {
          transactionType: 'expense',
          amount: 300,
          category: 'Shopping',
          description: 'Clothes',
          month: currentMonth,
          year: currentYear
        }
      ];
      
      console.log('Creating test transactions:', testTransactions);
      
      for (const transaction of testTransactions) {
        try {
          await axios.post('http://localhost:5000/api/transactions', transaction, { headers });
          console.log(`Test transaction created for ${transaction.category}`);
        } catch (transactionError) {
          console.error(`Error creating transaction for ${transaction.category}:`, transactionError.response?.data);
        }
      }
      
      // Refresh data after creating test data
      setTimeout(() => {
        loadBudgetData();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating test budget:', error);
      setError(error.response?.data?.error || 'Failed to create test budget');
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAlertIcon = (percentage) => {
    if (percentage >= 100) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (percentage >= 80) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Management</h1>
            <p className="text-lg text-gray-700">Monitor your spending and stay on track with your financial goals</p>
          </div>
          <Button 
            onClick={() => {
              console.log('Create Budget button clicked');
              setShowForm(true);
            }}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer z-10 min-w-fit"
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white',
              border: 'none',
              pointerEvents: 'auto'
            }}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Budget
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Debug Info - Temporary for troubleshooting */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
          <div className="text-sm">
            <p><strong>Debug Status:</strong></p>
            <p>Show Form: {showForm ? 'true' : 'false'}</p>
            <p>Selected Budget: {selectedBudget ? selectedBudget._id : 'none'}</p>
            <p>Budgets Count: {budgets.length}</p>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>Current Time: {new Date().toLocaleString()}</p>
            <div className="flex gap-2 mt-2">
              <Button 
                onClick={() => {
                  console.log('Refresh clicked');
                  loadBudgetData();
                }}
                size="sm"
                className="bg-blue-600 text-white"
              >
                Refresh Data
              </Button>
              <Button 
                onClick={() => {
                  console.log('Create test budget clicked');
                  createTestBudget();
                }}
                size="sm"
                className="bg-green-600 text-white"
              >
                Create Test Data
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        {budgetAnalytics && budgetAnalytics.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Budget</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(budgetAnalytics.overview.totalBudget || 0)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(budgetAnalytics.overview.totalSpent || 0)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Remaining</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(budgetAnalytics.overview.remaining || 0)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Overspending</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(budgetAnalytics.overview.overspending || 0)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgetAnalytics && (
            <BudgetCharts 
              budgetAnalytics={budgetAnalytics}
              budgets={budgets}
            />
          )}
        </div>

        {/* Budget List */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl font-bold">Your Budgets</CardTitle>
            <CardDescription className="text-blue-100 text-base">
              Manage your category-wise spending limits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            {budgets.length === 0 ? (
              <div className="text-center py-16">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No budgets created yet</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">Start by creating your first budget to track your spending and stay on top of your finances</p>
                <Button 
                  onClick={() => {
                    console.log('Create First Budget clicked');
                    setShowForm(true);
                  }}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ 
                    backgroundColor: '#2563eb', 
                    color: 'white',
                    border: 'none',
                    pointerEvents: 'auto'
                  }}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Your First Budget
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((budget) => {
                  // Fix data access - use budgetAmount and spentAmount from backend
                  const budgetAmount = budget.budgetAmount || budget.amount || 0;
                  const spentAmount = budget.spentAmount || budget.spent || 0;
                  const spentPercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
                  const isOverspent = spentPercentage > 100;
                  const remainingAmount = Math.max(0, budgetAmount - spentAmount);
                  
                  return (
                    <div key={budget._id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 capitalize">{budget.category}</h3>
                        {getAlertIcon(spentPercentage)}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-base font-medium text-gray-700">Budget</span>
                          <span className="text-lg font-bold text-black">{formatCurrency(budgetAmount)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-base font-medium text-gray-700">Spent</span>
                          <span className={`text-lg font-bold ${isOverspent ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatCurrency(spentAmount)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-base font-medium text-gray-700">Remaining</span>
                          <span className={`text-lg font-bold ${isOverspent ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(isOverspent ? 0 : remainingAmount)}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-3 py-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-medium text-gray-700">Progress</span>
                            <span className={`text-lg font-bold ${isOverspent ? 'text-red-600' : 'text-black'}`}>
                              {Math.round(spentPercentage)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(spentPercentage)} shadow-sm`}
                              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {isOverspent && (
                          <div className="flex items-center gap-3 text-sm font-medium text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Budget exceeded by {formatCurrency(spentAmount - budgetAmount)}</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={() => {
                              console.log('Edit button clicked for budget:', budget._id);
                              handleEditBudget(budget);
                            }}
                            variant="outline"
                            size="default"
                            className="flex-1 border-2 border-blue-400 text-blue-700 hover:bg-blue-50 hover:border-blue-500 font-semibold py-2 px-4"
                            style={{ 
                              borderColor: '#3b82f6', 
                              color: '#1d4ed8',
                              backgroundColor: 'white',
                              pointerEvents: 'auto'
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            onClick={() => {
                              console.log('Delete button clicked for budget:', budget._id);
                              handleDeleteBudget(budget._id);
                            }}
                            variant="outline"
                            size="default"
                            className="flex-1 border-2 border-red-400 text-red-700 hover:bg-red-50 hover:border-red-500 font-semibold py-2 px-4"
                            style={{ 
                              borderColor: '#ef4444', 
                              color: '#dc2626',
                              backgroundColor: 'white',
                              pointerEvents: 'auto'
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm overflow-hidden">
            <div className="w-full max-w-md max-h-[90vh] overflow-visible rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
              <BudgetForm
                budget={selectedBudget}
                onSubmit={handleBudgetSaved}
                onCancel={() => {
                  console.log('Form cancelled');
                  setShowForm(false);
                  setSelectedBudget(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManagement;