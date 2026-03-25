import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/Dashboard/SummaryCards';
import PieChart from '../components/Dashboard/PieChart';
import BarChart from '../components/Dashboard/BarChart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import axios from '../api/axios';
import { API_ENDPOINTS } from '../api/apiPath';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.DASHBOARD);
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {/* Summary Cards */}
          <SummaryCards summary={dashboardData?.summary} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <PieChart 
              data={dashboardData?.expenseByCategory} 
              title="Expense by Category" 
            />
            <PieChart 
              data={dashboardData?.incomeByCategory} 
              title="Income by Category" 
            />
          </div>

          {/* Bar Chart */}
          <div className="mt-8">
            <BarChart 
              incomeData={dashboardData?.monthlyData?.income}
              expenseData={dashboardData?.monthlyData?.expense}
            />
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <RecentTransactions transactions={dashboardData?.recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
