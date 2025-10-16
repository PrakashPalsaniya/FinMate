import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeChart = ({ incomes }) => {
  const getCategoryData = () => {
    const categoryTotals = {};
    
    incomes?.forEach(income => {
      if (categoryTotals[income.category]) {
        categoryTotals[income.category] += income.amount;
      } else {
        categoryTotals[income.category] = income.amount;
      }
    });

    return categoryTotals;
  };

  const categoryData = getCategoryData();
  const categories = Object.keys(categoryData);
  const values = Object.values(categoryData);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Income by Category',
        data: values,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(20, 184, 166, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Category</h3>
      <div className="h-80">
        {categories.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No income data available
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeChart;
