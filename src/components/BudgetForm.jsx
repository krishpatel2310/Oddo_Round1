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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{budget ? 'Edit Budget' : 'Create Budget'}</CardTitle>
              <CardDescription>
                {budget ? 'Update your budget settings' : 'Set up a new budget for a category'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Amount */}
            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount *</Label>
              <Input
                id="budgetAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter budget amount"
                value={formData.budgetAmount}
                onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
                required
              />
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select 
                value={formData.period} 
                onValueChange={(value) => handleInputChange('period', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alert Threshold */}
            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
              <Input
                id="alertThreshold"
                type="number"
                min="0"
                max="100"
                placeholder="Alert when % of budget is used"
                value={formData.alertThreshold}
                onChange={(e) => handleInputChange('alertThreshold', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You'll be alerted when you reach this percentage of your budget
              </p>
            </div>

            {/* Alert Enabled */}
            <div className="flex items-center space-x-2">
              <input
                id="alertEnabled"
                type="checkbox"
                checked={formData.alertEnabled}
                onChange={(e) => handleInputChange('alertEnabled', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="alertEnabled" className="text-sm">
                Enable budget alerts
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {budget ? 'Update Budget' : 'Create Budget'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetForm;