import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { RefreshCw, TrendingUp, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import axios from 'axios';

const BudgetCharts = ({ budgetAnalytics, onRefresh }) => {
  const [spendingTrends, setSpendingTrends] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [selectedPeriod, setSelectedPeriod] = useState('last6months');
  const [loading, setLoading] = useState(false);

  // Colors for charts
  const COLORS = {
    Food: '#8884d8',
    Transport: '#82ca9d',
    Bills: '#ffc658',
    Shopping: '#ff7300',
    Health: '#00ff88',
    Others: '#ff0066'
  };

  const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88', '#ff0066'];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5000/api/budgets/spending-trends?period=${selectedPeriod}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process the data for charts
        const processedData = Object.entries(response.data.spendingTrends).map(([month, categories]) => ({
          month,
          ...categories,
          total: Object.values(categories).reduce((sum, value) => sum + value, 0)
        }));
        
        setSpendingTrends(processedData);
      } catch (error) {
        console.error('Error loading spending trends:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedPeriod]);



  const getBudgetVsSpentData = () => {
    if (!budgetAnalytics?.categoryData || budgetAnalytics.categoryData.length === 0) {
      console.log('No budget category data available');
      return [];
    }
    
    const data = budgetAnalytics.categoryData.map(item => ({
      category: item.category,
      budgeted: item.budgeted || 0,
      spent: item.spent || 0,
      remaining: item.remaining || 0,
      percentage: parseFloat(item.percentage || 0)
    }));
    
    console.log('Budget vs Spent data:', data);
    return data;
  };

  const getPieChartData = () => {
    if (!budgetAnalytics?.categoryData) return [];
    
    return budgetAnalytics.categoryData
      .filter(item => item.spent > 0)
      .map(item => ({
        name: item.category,
        value: item.spent,
        color: COLORS[item.category] || '#8884d8'
      }));
  };

  const getUtilizationData = () => {
    if (!budgetAnalytics?.categoryData) return [];
    
    return budgetAnalytics.categoryData.map(item => ({
      category: item.category,
      utilization: parseFloat(item.percentage),
      budget: item.budgeted,
      spent: item.spent
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ${entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.payload.name}</p>
          <p style={{ color: data.payload.color }}>
            Amount: ${data.value?.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {((data.value / data.payload.total) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const data = getBudgetVsSpentData();
    
    switch (chartType) {
      case 'pie': {
        const pieData = getPieChartData();
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      }

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(COLORS).map((category) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={COLORS[category]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(COLORS).map((category) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={COLORS[category]}
                  fill={COLORS[category]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              <Line type="monotone" dataKey="percentage" stroke="#ff7300" name="Utilization %" />
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Budget Analytics & Charts</CardTitle>
              <CardDescription>Visual representation of your budget performance</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Bar
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="h-4 w-4" />
                      Pie
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4" />
                      Line
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Area
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : budgetAnalytics && budgetAnalytics.categoryData && budgetAnalytics.categoryData.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="text-center">
                <p className="text-lg font-semibold">No budget data available</p>
                <p className="text-sm">Create some budgets to see charts</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization by Category</CardTitle>
          <CardDescription>Percentage of budget used for each category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getUtilizationData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'utilization' ? `${value}%` : `$${value.toFixed(2)}`,
                  name === 'utilization' ? 'Utilization' : name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Legend />
              <Bar 
                dataKey="utilization" 
                fill={(entry) => {
                  const util = entry?.utilization || 0;
                  if (util >= 100) return '#ef4444';
                  if (util >= 80) return '#f59e0b';
                  return '#10b981';
                }}
                name="Utilization %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      {budgetAnalytics?.trendData && budgetAnalytics.trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget Trends</CardTitle>
            <CardDescription>Budget vs spending trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={budgetAnalytics.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalBudget" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Total Budget"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalSpent" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Total Spent"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name="Utilization %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetCharts;