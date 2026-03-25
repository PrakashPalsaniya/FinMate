import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import IncomeForm from '../components/Income/IncomeForm';
import IncomeList from '../components/Income/IncomeList';
import IncomeChart from '../components/Income/IncomeChart';
import DownloadIncomeBtn from '../components/Income/DownloadIncomeBtn';
import axios from '../api/axios';
import { API_ENDPOINTS } from '../api/apiPath';
import { toast } from 'react-toastify';

const Income = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.INCOME);
      if (response.data.success) {
        setIncomes(response.data.data);
      }
    } catch {
      toast.error('Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeAdded = () => {
    fetchIncomes();
  };

  const handleIncomeDeleted = () => {
    fetchIncomes();
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
            <h1 className="text-3xl font-bold text-gray-800">Income Management</h1>
            <DownloadIncomeBtn />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncomeForm onIncomeAdded={handleIncomeAdded} />
            <IncomeChart incomes={incomes} />
          </div>

          <div className="mt-8">
            <IncomeList incomes={incomes} onIncomeDeleted={handleIncomeDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
