import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "react-router-dom";
export default function Dashboard() {
  const [date, setDate] = useState(new Date())
  const [income, setIncome] = useState(25000);
  const [expenses, setExpenses] = useState(18200);
  const [budget, setBudget] = useState(20000);

// savings is derived, not stored
const savings = income - expenses;

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-slate-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 backdrop-blur-sm border-b border-slate-700/50">
        <div className="text-2xl font-bold text-white">
          Expense<span className="text-slate-300">Tracker</span>
        </div>
        <div className="flex items-center space-x-6">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
            Analytics
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
            Transactions
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
            Settings
          </Button>
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
            <span className="text-white font-semibold">JD</span>
          </div>
        </div>
      </nav>
      
      <div className="relative z-10 p-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight mb-2">
              Dashboard Overview
            </h1>
            <p className="text-slate-400">Welcome back! Here's your financial summary</p>
          </div>
          <div className="flex gap-3">
            <Link to="/expense">
            <Button className="bg-slate-700 hover:bg-slate-600 text-white">
              Add Transaction
            </Button>
            </Link>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800/50">
              Export Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-500 hover:transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-3xl font-bold text-slate-50 mb-2">₹ 25,000</p>
              <p className="text-sm text-slate-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-500 hover:transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-3xl font-bold text-slate-50 mb-2">₹ 18,200</p>
              <p className="text-sm text-slate-400">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-500 hover:transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Budget Limit
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-3xl font-bold text-slate-50 mb-2">₹ 20,000</p>
              <p className="text-sm text-slate-400">91% utilized</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-500 hover:transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                Net Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-3xl font-bold text-slate-50 mb-2">₹ 6,800</p>
              <p className="text-sm text-slate-400">27% of income</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert className="relative overflow-hidden bg-slate-800/50 border-slate-600 backdrop-blur-sm">
          <div className="absolute inset-0 bg-slate-700/20"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center animate-pulse">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.19 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <AlertTitle className="text-slate-200 font-semibold">Budget Alert</AlertTitle>
              <AlertDescription className="text-slate-300">
                You've reached 91% of your monthly budget! Consider reviewing your expenses.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <Card className="lg:col-span-2 relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-slate-600/10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Income vs Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="h-80 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                    </svg>
                  </div>
                  <p className="text-slate-300 text-lg font-semibold mb-2">Interactive Chart Coming Soon</p>
                  <p className="text-slate-500">Advanced analytics with real-time data visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-slate-600/10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border-slate-700 [&_.rdp-day_selected]:bg-slate-600 [&_.rdp-day_selected]:text-white [&_.rdp-day]:text-slate-300 [&_.rdp-day:hover]:bg-slate-700"
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-16 bg-slate-700 hover:bg-slate-600 text-left justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <span>Add Income</span>
            </div>
          </Button>
          
         
<Link to="/expense">
  <Button className="h-16 bg-slate-700 hover:bg-slate-600 text-left justify-start w-full">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
        <span className="text-lg">💳</span>
      </div>
      <span>Add Expense</span>
    </div>
  </Button>
</Link>
          
          <Button className="h-16 bg-slate-700 hover:bg-slate-600 text-left justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <span>Set Budget</span>
            </div>
          </Button>
          
          <Button className="h-16 bg-slate-700 hover:bg-slate-600 text-left justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <span>View Reports</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}