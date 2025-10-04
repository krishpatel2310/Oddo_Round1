import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import BudgetCharts from '../components/BudgetCharts';
import BudgetForm from '../components/BudgetForm';
import axios from 'axios';
import { AlertTriangle, DollarSign, Target, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetAnalytics, setBudgetAnalytics] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }
      
      // Load budgets and analytics
      const [budgetsRes, analyticsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/budgets?month=${currentMonth}&year=${currentYear}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/budgets/analytics?month=${currentMonth}&year=${currentYear}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('Budgets response:', budgetsRes.data);
      console.log('Analytics response:', analyticsRes.data);
      
      setBudgets(budgetsRes.data);
      setBudgetAnalytics(analyticsRes.data);
      setAlerts(analyticsRes.data.alerts || []);
    } catch (error) {
      console.error('Error loading budget data:', error);
      setAlerts([]);
      setBudgets([]);
      setBudgetAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, [currentMonth, currentYear]);

  const handleCreateBudget = async (budgetData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/budgets', {
        ...budgetData,
        month: currentMonth,
        year: currentYear
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowForm(false);
      loadBudgetData();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/budgets', {
        ...budgetData,
        month: currentMonth,
        year: currentYear
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingBudget(null);
      setShowForm(false);
      loadBudgetData();
    } catch (error) {
      console.error('Error updating budget:', error);
    }
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
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (budget) => {
    if (budget.isExceeded) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Exceeded</Badge>;
    }
    const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
    if (percentage >= 80) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 border-green-200">On Track</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Budget Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your budgets and track spending for {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowForm(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Budget
              </Button>
              <Button 
                onClick={async () => {
                  // Create sample budgets for testing
                  const sampleBudgets = [
                    { category: 'Food', budgetAmount: 500, alertThreshold: 80 },
                    { category: 'Transport', budgetAmount: 200, alertThreshold: 75 },
                    { category: 'Bills', budgetAmount: 800, alertThreshold: 90 }
                  ];
                  
                  for (const budget of sampleBudgets) {
                    await handleCreateBudget(budget);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                Add Sample Data
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-l-4 shadow-md ${
                  alert.type === 'error' 
                    ? 'bg-red-50 border-red-500 text-red-800' 
                    : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p className="font-medium">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Cards */}
        {budgetAnalytics && budgetAnalytics.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Budget</h3>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">${budgetAnalytics.overview.totalBudget.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Spent</h3>
                <div className="p-3 bg-red-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">${budgetAnalytics.overview.totalSpent.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Remaining</h3>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">${budgetAnalytics.overview.totalRemaining.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Utilization</h3>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{budgetAnalytics.overview.budgetUtilization}%</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {budgetAnalytics ? (
          <div className="bg-white rounded-xl shadow-lg">
            <BudgetCharts 
              budgetAnalytics={budgetAnalytics}
              onRefresh={loadBudgetData}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No budget analytics data available</p>
              <p className="text-sm text-gray-400 mt-2">Create some budgets and add transactions to see charts</p>
            </div>
          </div>
        )}

        {/* Budget List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Your Budgets</h2>
            <p className="text-gray-600 mt-1">Manage your category budgets and track spending</p>
          </div>
          <div className="p-6">
            {budgets.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4 text-lg">No budgets created yet</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md"
                >
                  Create Your First Budget
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {budgets.map((budget) => {
                  const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
                  
                  return (
                    <div key={budget._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{budget.category}</h3>
                            {getStatusBadge(budget)}
                          </div>
                          <p className="text-sm text-gray-600">
                            ${budget.spentAmount.toFixed(2)} / ${budget.budgetAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setEditingBudget(budget);
                              setShowForm(true);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleDeleteBudget(budget._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-3 py-2 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium">{percentage.toFixed(1)}% used</span>
                        <span className={`font-medium ${budget.isExceeded ? 'text-red-600' : 'text-green-600'}`}>
                          {budget.isExceeded 
                            ? `$${budget.exceededAmount.toFixed(2)} over budget`
                            : `$${budget.remainingAmount.toFixed(2)} remaining`
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Budget Form Modal */}
        {showForm && (
          <BudgetForm
            budget={editingBudget}
            onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
            onCancel={() => {
              setShowForm(false);
              setEditingBudget(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetManagement;