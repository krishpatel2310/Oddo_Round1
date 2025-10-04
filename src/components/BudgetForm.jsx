import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';

const BudgetForm = ({ budget, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    budgetAmount: '',
    period: 'monthly',
    alertThreshold: 80,
    alertEnabled: true
  });

  const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Others"];

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category || '',
        budgetAmount: budget.budgetAmount?.toString() || '',
        period: budget.period || 'monthly',
        alertThreshold: budget.alertThreshold || 80,
        alertEnabled: budget.alertEnabled !== undefined ? budget.alertEnabled : true
      });
    }
  }, [budget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.budgetAmount) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      ...formData,
      budgetAmount: parseFloat(formData.budgetAmount),
      alertThreshold: parseInt(formData.alertThreshold)
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full mx-auto bg-white shadow-2xl border-0 overflow-visible">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold">
              {budget ? 'Edit Budget' : 'Create Budget'}
            </CardTitle>
            <CardDescription className="text-blue-100 text-sm mt-1">
              {budget ? 'Update your budget settings' : 'Set up a new budget for a category'}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="text-white hover:bg-white/20 rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
        <CardContent className="p-6 bg-white overflow-visible">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Category *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger className="h-10 text-sm border-2 border-gray-300 focus:border-blue-500 bg-white focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent 
                  className="z-[9999] bg-white border border-gray-300 shadow-2xl max-h-48 overflow-y-auto rounded-md min-w-[200px]"
                  position="popper"
                  sideOffset={4}
                >
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-sm py-2 px-3 text-black hover:bg-blue-50 cursor-pointer focus:bg-blue-100 data-[highlighted]:bg-blue-50">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Amount */}
            <div className="space-y-2">
              <Label htmlFor="budgetAmount" className="text-sm font-semibold text-gray-700">
                Budget Amount (₹) *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-semibold">
                  ₹
                </span>
                <Input
                  id="budgetAmount"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Enter budget amount"
                  value={formData.budgetAmount}
                  onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
                  required
                  className="h-10 pl-8 text-sm border-2 border-gray-300 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label htmlFor="period" className="text-sm font-semibold text-gray-700">
                Period
              </Label>
              <Select 
                value={formData.period} 
                onValueChange={(value) => handleInputChange('period', value)}
              >
                <SelectTrigger className="h-10 text-sm border-2 border-gray-300 focus:border-blue-500 bg-white focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select budget period" />
                </SelectTrigger>
                <SelectContent 
                  className="z-[9999] bg-white border border-gray-300 shadow-2xl max-h-48 overflow-y-auto rounded-md min-w-[200px]"
                  position="popper"
                  sideOffset={4}
                >
                  <SelectItem value="weekly" className="text-sm py-2 px-3 text-black hover:bg-blue-50 cursor-pointer focus:bg-blue-100 data-[highlighted]:bg-blue-50">Weekly</SelectItem>
                  <SelectItem value="monthly" className="text-sm py-2 px-3 text-black hover:bg-blue-50 cursor-pointer focus:bg-blue-100 data-[highlighted]:bg-blue-50">Monthly</SelectItem>
                  <SelectItem value="yearly" className="text-sm py-2 px-3 text-black hover:bg-blue-50 cursor-pointer focus:bg-blue-100 data-[highlighted]:bg-blue-50">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alert Threshold */}
            <div className="space-y-2">
              <Label htmlFor="alertThreshold" className="text-sm font-semibold text-gray-700">
                Alert Threshold (%)
              </Label>
              <div className="relative">
                <Input
                  id="alertThreshold"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="80"
                  value={formData.alertThreshold}
                  onChange={(e) => handleInputChange('alertThreshold', e.target.value)}
                  className="h-10 pr-8 text-sm border-2 border-gray-300 focus:border-blue-500 bg-white"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-semibold">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                💡 You'll be alerted when you reach this percentage
              </p>
            </div>

            {/* Alert Enabled */}
            <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border-2 border-gray-200">
              <input
                id="alertEnabled"
                type="checkbox"
                checked={formData.alertEnabled}
                onChange={(e) => handleInputChange('alertEnabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Label htmlFor="alertEnabled" className="text-sm font-medium text-gray-700">
                🔔 Enable budget alerts
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 h-10 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {budget ? '✏️ Update Budget' : '➕ Create Budget'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="h-10 px-4 text-sm font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  );
};

export default BudgetForm;