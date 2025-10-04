import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  User,
  BarChartBig,
  TrendingUp,
  Receipt,
  PieChart,
  ShoppingBag,
  Home,
  Car,
  Heart,
  MoreHorizontal
} from "lucide-react";

// Category icons mapping
const categoryIcons = {
  'Food': ShoppingBag,
  'Transport': Car, 
  'Bills': Home,
  'Shopping': ShoppingBag,
  'Health': Heart,
  'Others': MoreHorizontal
};

// Category colors
const categoryColors = {
  'Food': 'bg-orange-500',
  'Transport': 'bg-blue-500',
  'Bills': 'bg-purple-500', 
  'Shopping': 'bg-pink-500',
  'Health': 'bg-green-500',
  'Others': 'bg-gray-500'
};

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [budgetOverview, setBudgetOverview] = useState(null);





  // Process analytics data from transactions
  const processAnalyticsData = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setAnalyticsData({ categoryData: [], totalExpenses: 0 });
      return;
    }

    // Filter expenses only
    const expenses = transactions.filter(t => t.transactionType === 'expense');
    
    // Group by category and calculate totals
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const category = transaction.category || 'Others';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    // Convert to array and sort by amount (highest first)
    const categoryData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    setAnalyticsData({ categoryData, totalExpenses });
  };

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");
    

    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // If no token, don't make API calls
    if (!token) {
      setError("Please log in to view dashboard");
      setIsLoading(false);
      // Redirect to login page
      window.location.href = '/login';
      return;
    }

    const fetchDashboardData = async () => {
      try {

        
        // Fetch summary data
        const summaryResponse = await fetch("http://localhost:5000/api/transactions/summary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!summaryResponse.ok) {
          throw new Error(`Failed to fetch dashboard data: ${summaryResponse.status} ${summaryResponse.statusText}`);
        }
        
        const summaryData = await summaryResponse.json();
        setSummaryData(summaryData);

        // Fetch recent transactions
        const transactionsResponse = await fetch("http://localhost:5000/api/transactions?limit=5", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData.transactions || []);
          
          // Process analytics data from transactions
          processAnalyticsData(transactionsData.transactions || []);
        }

        // Fetch budget overview
        try {
          const budgetResponse = await fetch("http://localhost:5000/api/budgets/analytics", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (budgetResponse.ok) {
            const budgetData = await budgetResponse.json();
            setBudgetOverview(budgetData);
          }
        } catch (budgetErr) {
          console.error('Error fetching budget data:', budgetErr);
        }
        
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="bg-red-50 p-8 rounded-lg text-red-600 text-center max-w-md">
          <p className="font-semibold text-lg">Error: {error}</p>
          <p className="mt-2 text-sm text-gray-600">Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Get user display values
  const userName = user?.name || (user?.email ? user.email.split('@')[0] : "User");
  const userEmail = user?.email || "user@example.com";

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Total Balance */}
          <Card className="w-full shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-in slide-in-from-top duration-700 fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-100">Total Balance</p>
                <Badge className="bg-green-500 text-white border-0">Active</Badge>
              </div>
              <p className="text-5xl font-bold mb-6">
                ₹{summaryData?.savings?.toLocaleString("en-IN") || "0"}
              </p>
              <div className="flex items-center gap-8 pt-6 border-t border-blue-400">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <ArrowUpRight className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <p className="text-blue-100">Income</p>
                    <p className="text-lg font-semibold">
                      ₹{summaryData?.income?.toLocaleString("en-IN") || "0"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <ArrowDownRight className="h-5 w-5 text-red-300" />
                  </div>
                  <div>
                    <p className="text-blue-100">Expenses</p>
                    <p className="text-lg font-semibold">
                      ₹{summaryData?.expenses?.toLocaleString("en-IN") || "0"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Analytics */}
          <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 animate-in slide-in-from-left duration-700 fade-in" style={{animationDelay: '200ms'}}>
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <PieChart className="h-5 w-5 text-blue-600" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {analyticsData?.categoryData?.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.categoryData.slice(0, 5).map((item) => {
                    const percentage = analyticsData.totalExpenses > 0 
                      ? ((item.amount / analyticsData.totalExpenses) * 100).toFixed(1)
                      : 0;
                    const IconComponent = categoryIcons[item.category] || MoreHorizontal;
                    const colorClass = categoryColors[item.category] || 'bg-gray-500';
                    
                    return (
                      <div key={item.category} className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${colorClass}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-700">{item.category}</span>
                            <span className="font-semibold text-gray-900">
                              ₹{(item?.amount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${colorClass}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{percentage}% of expenses</div>
                        </div>
                      </div>
                    );
                  })}
                  {analyticsData.categoryData.length > 5 && (
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-500">
                        +{analyticsData.categoryData.length - 5} more categories
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl text-center p-6">
                  <div className="p-4 bg-white rounded-full shadow-md mb-4">
                    <PieChart className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-700">No expense data</p>
                  <p className="text-sm text-gray-500 mt-1">Add some expenses to see breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Overview */}
          {budgetOverview && budgetOverview.overview && (
            <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 animate-in slide-in-from-left duration-700 fade-in" style={{animationDelay: '300ms'}}>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <BarChartBig className="h-5 w-5 text-green-600" />
                  Budget Overview
                  <Link to="/budget-management">
                    <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-800 font-semibold ml-auto">
                      Manage →
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {budgetOverview.overview.totalBudget > 0 ? (
                  <div className="space-y-4">
                    {/* Budget Summary */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <p className="text-lg font-bold text-blue-600">
                          ₹{(budgetOverview?.overview?.totalBudget || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{(budgetOverview?.overview?.totalRemaining || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Budget Utilization */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Overall Utilization</span>
                        <span className="text-sm font-bold text-gray-900">
                          {(budgetOverview?.overview?.budgetUtilization || 0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            (budgetOverview?.overview?.budgetUtilization || 0) >= 100 ? 'bg-red-500' : 
                            (budgetOverview?.overview?.budgetUtilization || 0) >= 80 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budgetOverview?.overview?.budgetUtilization || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Category Budgets (Top 3) */}
                    {budgetOverview.categoryData && budgetOverview.categoryData.slice(0, 3).map((budget) => {
                      const percentage = parseFloat(budget?.percentage || 0);
                      const IconComponent = categoryIcons[budget?.category] || MoreHorizontal;
                      const colorClass = categoryColors[budget?.category] || 'bg-gray-500';
                      
                      return (
                        <div key={budget.category} className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${colorClass}`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-700">{budget.category}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                ₹{(budget?.spent || 0).toLocaleString('en-IN')} / ₹{(budget?.budgeted || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  percentage >= 100 ? 'bg-red-500' : 
                                  percentage >= 80 ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{percentage.toFixed(1)}% used</span>
                              {budget.isExceeded && (
                                <span className="text-red-600 font-medium">
                                  ₹{budget.exceededAmount.toFixed(2)} over
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Budget Alerts */}
                    {budgetOverview.alerts && budgetOverview.alerts.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-semibold text-yellow-800 mb-1">Budget Alerts</p>
                        <p className="text-xs text-yellow-700">
                          {budgetOverview.alerts.length} budget{budgetOverview.alerts.length > 1 ? 's' : ''} need{budgetOverview.alerts.length === 1 ? 's' : ''} attention
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 rounded-xl text-center p-6">
                    <div className="p-3 bg-white rounded-full shadow-md mb-3">
                      <BarChartBig className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-700">No budgets set</p>
                    <p className="text-sm text-gray-500 mt-1">Create budgets to track spending</p>
                    <Link to="/budget-management">
                      <Button size="sm" className="mt-2">
                        <Plus className="mr-1 h-3 w-3" />
                        Set Budget
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
            <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1 animate-in slide-in-from-bottom duration-700 fade-in" style={{animationDelay: '500ms'}}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-md">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">This Month Income</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{summaryData?.income?.toLocaleString("en-IN") || "0"}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-md">
                  <ArrowDownRight className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">This Month Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{summaryData?.expenses?.toLocaleString("en-IN") || "0"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Recent Transactions */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-gray-800">Recent Transactions</CardTitle>
              <Link to="/expencehistory">
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 font-semibold">
                  View all →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {transactions && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full shadow-sm ${
                            transaction.transactionType === "income" 
                              ? "bg-gradient-to-br from-green-400 to-green-500" 
                              : "bg-gradient-to-br from-red-400 to-red-500"
                          }`}
                        >
                          {transaction.transactionType === "income" ? (
                            <ArrowUpRight className="h-4 w-4 text-white" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {transaction.transactionType === 'income' 
                              ? (transaction.source || 'Income') 
                              : (transaction.description || transaction.category || 'Expense')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${
                            transaction.transactionType === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.transactionType === "income" ? "+" : "-"}₹
                          {Math.abs(transaction?.amount || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {transaction.transactionType === 'income' 
                            ? (transaction.incomeType || 'Income') 
                            : (transaction.category || 'Expense')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
                  <div className="p-4 bg-white rounded-full shadow-md mb-4">
                    <Wallet className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-700 text-lg">No transactions yet</p>
                  <p className="text-black mt-1">Add your first transaction to get started</p>
                  <Link to="/add-transaction">
                    <Button className="mt-4 text-black hover:bg-slate-50 shadow-md">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transaction
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar className="h-16 w-16 shadow-md ring-4 ring-white">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${userName}&background=E0E7FF&color=4338CA&size=128`}
                      alt={userName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-xl">{userName}</p>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-800 border-0">Premium User</Badge>
                </div>
              </div>
              <div className="space-y-4 bg-white/70 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-medium">Currency</span>
                  <span className="text-sm font-semibold text-gray-800">INR (₹)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-medium">Account Status</span>
                  <Badge className="bg-green-500 text-white border-0 shadow-sm">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-medium">Member Since</span>
                  <span className="text-sm font-semibold text-gray-800">Jan 2024</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}