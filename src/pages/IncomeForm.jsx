// In src/pages/IncomeForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IncomeForm() {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState(""); // This will be our "category" for income
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type) {
      setError("Please select an income type.");
      return;
    }

    setIsLoading(true);
    setError("");

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("You must be logged in to add income.");
      setIsLoading(false);
      return;
    }

    const incomeData = {
      amount: parseFloat(amount),
      source,
      type,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        'http://localhost:5000/api/incomes', // The backend endpoint for incomes
        incomeData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to add income.";
      setError(errorMessage);
      console.error("Error adding income:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Define income types
  const incomeTypes = ["Salary", "Bonus", "Investment", "Freelance", "Gift", "Other"];

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg rounded-2xl bg-slate-900 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Add New Income
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <div>
            <Label htmlFor="source">Income Source</Label>
            <Input
              id="source"
              type="text"
              placeholder="e.g. Monthly Salary"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              className="bg-slate-800 border-slate-600"
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-slate-800 border-slate-600"
            />
          </div>

          <div>
            <Label htmlFor="type">Income Type</Label>
            <Select onValueChange={setType} value={type} required>
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-white">
                {incomeTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Add Income'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}