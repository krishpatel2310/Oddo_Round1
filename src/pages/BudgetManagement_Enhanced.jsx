import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertTriangle, TrendingUp, TrendingDown, PlusCircle, Target, DollarSign, Calendar, AlertCircle, BarChart3, PieChart, Activity, Wallet, ShoppingBag, Home, Car, Heart, MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, Pie } from 'recharts';
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

  // Chart color schemes
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

  // Category icons mapping
  const categoryIcons = {
    'Food': ShoppingBag,
    'Transport': Car,
    'Bills': Home,
    'Shopping': ShoppingBag,
    'Health': Heart,
    'Others': MoreHorizontal
  };

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
      setError('');
      
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
      
      // Load budgets with month/year parameters
      const budgetsResponse = await axios.get(`http://localhost:5000/api/budgets?month=${currentMonth}&year=${currentYear}`, { headers });
      setBudgets(budgetsResponse.data.budgets || []);

      // Load analytics with month/year parameters
      const analyticsResponse = await axios.get(`http://localhost:5000/api/budgets/analytics?month=${currentMonth}&year=${currentYear}`, { headers });
      setBudgetAnalytics(analyticsResponse.data);
      
    } catch (error) {
      console.error('Error loading budget data:', error);
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      
      if (selectedBudget) {
        // Update existing budget
        await axios.put(`http://localhost:5000/api/budgets/${selectedBudget._id}`, budgetPayload, { headers });
      } else {
        // Create new budget
        await axios.post('http://localhost:5000/api/budgets', budgetPayload, { headers });
      }
      
      setShowForm(false);
      setSelectedBudget(null);
      loadBudgetData();
    } catch (error) {
      console.error('Error saving budget:', error);
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

  // Prepare chart data
  const prepareChartData = () => {
    if (!budgets || budgets.length === 0) return { pieData: [], barData: [], lineData: [], radialData: [], areaData: [] };

    const pieData = budgets.map((budget, index) => ({
      name: budget.category,
      value: budget.spent || 0,
      budgeted: budget.budgetAmount,
      percentage: budget.budgetAmount > 0 ? ((budget.spent || 0) / budget.budgetAmount * 100).toFixed(1) : 0,
      color: COLORS[index % COLORS.length]
    }));

    const barData = budgets.map(budget => ({
      category: budget.category,
      spent: budget.spent || 0,
      budget: budget.budgetAmount,
      remaining: Math.max(0, budget.budgetAmount - (budget.spent || 0)),
      percentage: budget.budgetAmount > 0 ? ((budget.spent || 0) / budget.budgetAmount * 100) : 0
    }));

    const lineData = budgets.map(budget => ({
      category: budget.category,
      utilization: budget.budgetAmount > 0 ? ((budget.spent || 0) / budget.budgetAmount * 100) : 0,
      target: 80, // Target utilization percentage
    }));

    const radialData = budgets.map((budget, index) => ({
      name: budget.category,
      value: budget.budgetAmount > 0 ? Math.min(100, ((budget.spent || 0) / budget.budgetAmount * 100)) : 0,
      fill: COLORS[index % COLORS.length]
    }));

    const areaData = budgets.map((budget) => ({
      month: budget.category,
      spent: budget.spent || 0,
      budget: budget.budgetAmount,
      savings: Math.max(0, budget.budgetAmount - (budget.spent || 0))
    }));

    return { pieData, barData, lineData, radialData, areaData };
  };

  const { pieData, barData, lineData, radialData, areaData } = prepareChartData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Budget Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Comprehensive insights into your financial planning and spending patterns</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="h-5 w-5" />
              Create Budget
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(budgetAnalytics?.overview?.totalBudget || 0)}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(budgetAnalytics?.overview?.totalSpent || 0)}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Remaining</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(budgetAnalytics?.overview?.totalRemaining || 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Utilization</p>
                  <p className="text-2xl font-bold">
                    {(budgetAnalytics?.overview?.budgetUtilization || 0).toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Budget vs Spent Bar Chart */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Budget vs Spending Analysis
              </CardTitle>
              <CardDescription>Compare budgeted amounts with actual spending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#666" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" name="Spent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="remaining" name="Remaining" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spending Distribution Pie Chart */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <PieChart className="h-5 w-5 text-purple-600" />
                Spending Distribution
              </CardTitle>
              <CardDescription>Breakdown of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Budget Utilization Line Chart */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Activity className="h-5 w-5 text-green-600" />
                Budget Utilization Trends
              </CardTitle>
              <CardDescription>Track utilization percentage across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#666" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                    formatter={(value) => [`${value.toFixed(1)}%`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    name="Utilization %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target (80%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Area Chart for Budget Flow */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Budget Flow Analysis
              </CardTitle>
              <CardDescription>Visualize budget allocation and savings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="budget" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="url(#budgetGradient)" 
                    name="Budget"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spent" 
                    stackId="2" 
                    stroke="#EF4444" 
                    fill="url(#spentGradient)" 
                    name="Spent"
                  />
                  <defs>
                    <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Radial Chart and Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Radial Progress Chart */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Target className="h-5 w-5 text-pink-600" />
                Progress Overview
              </CardTitle>
              <CardDescription>Radial view of budget completion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Utilization']}
                  />
                  <Legend />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Activity className="h-5 w-5 text-emerald-600" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Key performance indicators for your budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {budgets.filter(b => (b.spent || 0) / b.budgetAmount <= 0.8).length}
                  </div>
                  <div className="text-sm text-gray-600">On Track</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {budgets.filter(b => (b.spent || 0) / b.budgetAmount > 0.8 && (b.spent || 0) / b.budgetAmount < 1).length}
                  </div>
                  <div className="text-sm text-gray-600">At Risk</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {budgets.filter(b => (b.spent || 0) / b.budgetAmount >= 1).length}
                  </div>
                  <div className="text-sm text-gray-600">Over Budget</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {budgets.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Budgets</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <DollarSign className="h-5 w-5 text-green-600" />
              Current Budgets
            </CardTitle>
            <CardDescription>Manage and monitor your active budgets</CardDescription>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No budgets found</h3>
                <p className="text-gray-600 mb-4">Create your first budget to start tracking your expenses</p>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {budgets.map((budget) => {
                  const percentage = budget.budgetAmount > 0 ? ((budget.spent || 0) / budget.budgetAmount) * 100 : 0;
                  const IconComponent = categoryIcons[budget.category] || MoreHorizontal;
                  
                  return (
                    <div key={budget._id} className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                            <p className="text-sm text-gray-600 capitalize">{budget.period} budget</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {percentage >= 100 && <AlertTriangle className="h-5 w-5 text-red-500" />}
                          {percentage >= 80 && percentage < 100 && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(budget.spent || 0)} / {formatCurrency(budget.budgetAmount)}
                            </p>
                            <p className="text-sm text-gray-600">{percentage.toFixed(1)}% used</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              percentage >= 100 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                              percentage >= 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Remaining: {formatCurrency(Math.max(0, budget.budgetAmount - (budget.spent || 0)))}</span>
                          {budget.alertEnabled && (
                            <span className="text-blue-600">
                              Alert at {budget.alertThreshold}%
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBudget(budget)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBudget(budget._id)}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <BudgetForm
                budget={selectedBudget}
                onSave={handleBudgetSaved}
                onCancel={() => {
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