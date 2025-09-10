import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

// Import meaningful icons from lucide-react
import {
  Wallet,
  CreditCard,
  PiggyBank,
  Target,
  Info,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  FileText,
} from 'lucide-react';

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("No authentication token found. Please log in.");
          setIsLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:5000/api/users/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummaryData(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Your session may have expired.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><p>Loading Dashboard...</p></div>;
  }

  if (error) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-red-600 text-center p-4">
      <p className="font-semibold">Error: {error}</p>
      <p className="mt-2 text-sm text-slate-600">Please try logging in again.</p>
    </div>;
  }

  const savingsPercentage = summaryData?.income > 0 
    ? Math.round((summaryData.savings / summaryData.income) * 100) 
    : 0;

  // Get user initials for the avatar
  const userName = JSON.parse(localStorage.getItem('user'))?.name || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-2xl font-bold text-slate-800">
                Expense<span className="text-blue-600">Tracker</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/transactions" className="text-slate-600 hover:text-blue-600 font-medium">Transactions</Link>
              <Link to="/set-budget" className="text-slate-600 hover:text-blue-600 font-medium">Budgets</Link>
              <Link to="#" className="text-slate-600 hover:text-blue-600 font-medium">Reports</Link>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Page Title & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 mt-1">Welcome back, {userName}! Here's your financial summary for the month.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/expense">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </Link>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Income</CardTitle>
              <Wallet className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">₹{summaryData?.income.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-green-600"/>+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
              <CreditCard className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">₹{summaryData?.expenses.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-red-600"/>+8% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Budget Limit</CardTitle>
              <Target className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">₹{summaryData?.budget.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 mt-1">{summaryData?.budgetUtilizationPercentage}% utilized</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Net Savings</CardTitle>
              <PiggyBank className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">₹{summaryData?.savings.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 mt-1">{savingsPercentage}% of income saved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Card */}
          <Card className="lg:col-span-2 bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="text-center text-slate-500">
                  <p className="font-medium mb-1">Interactive Chart Coming Soon</p>
                  <p className="text-sm">We're working on bringing you detailed visual analytics.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Card */}
          <Card className="bg-white shadow-sm border-slate-200 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                classNames={{
                  // Styles for the selected day and today's date
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600",
                  today: "bg-blue-100 text-blue-800",
                  
                  // ✅ FIXED: Added styles for visibility on the light theme
                  head_cell: "text-slate-500 font-normal w-9",
                  day: "h-9 w-9 text-slate-800",
                  nav_button: "h-7 w-7 opacity-50 hover:opacity-100 border border-slate-200",
                  caption_label: "text-sm font-medium text-slate-900",
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="pt-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/add-income" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                    <TrendingUp className="mx-auto h-8 w-8 text-green-500 mb-2"/>
                    <p className="font-semibold text-slate-700">Add Income</p>
                </Link>
                <Link to="/expense" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                    <TrendingDown className="mx-auto h-8 w-8 text-red-500 mb-2"/>
                    <p className="font-semibold text-slate-700">Add Expense</p>
                </Link>
                <Link to="/set-budget" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                    <Target className="mx-auto h-8 w-8 text-blue-500 mb-2"/>
                    <p className="font-semibold text-slate-700">Set Budget</p>
                </Link>
                <Link to="/transactions" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-500 mb-2"/>
                    <p className="font-semibold text-slate-700">View History</p>
                </Link>
            </div>
        </div>
      </main>
    </div>
  )
}