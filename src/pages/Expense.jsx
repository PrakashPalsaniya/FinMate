import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ExpenseForm from '../components/Expense/ExpenseForm';
import ExpenseList from '../components/Expense/ExpenseList';
import ExpenseChart from '../components/Expense/ExpenseChart';
import DownloadExpenseBtn from '../components/Expense/DownloadExpenseBtn';
import axios from '../api/axios';
import { API_ENDPOINTS } from '../api/apiPath';
import { toast } from 'react-toastify';

const Expense = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EXPENSE);
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    fetchExpenses();
  };

  const handleExpenseDeleted = () => {
    fetchExpenses();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Expense Management</h1>
            <DownloadExpenseBtn />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            <ExpenseChart expenses={expenses} />
          </div>

          <div className="mt-8">
            <ExpenseList expenses={expenses} onExpenseDeleted={handleExpenseDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
